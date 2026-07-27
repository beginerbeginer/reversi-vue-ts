import { Board, CellState } from "@/models/reversi";
import type { Point } from "@/models/reversi";

// _color は初級・中級では未使用だが、上位レベルで色を考慮するときのために
// 全レベルで統一インターフェースを保つ
export function selectMoveBeginner(
  board: Board,
  _color: CellState,
): Point | null {
  const moves = board.validMoves();
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

export function selectMoveIntermediate(
  board: Board,
  _color: CellState,
): Point | null {
  const moves = board.validMoves();
  if (moves.length === 0) return null;
  const scored = moves.map((p) => ({ p, flips: board.search(p).length }));
  const maxFlips = Math.max(...scored.map(({ flips }) => flips));
  const best = scored
    .filter(({ flips }) => flips === maxFlips)
    .map(({ p }) => p);
  return best[Math.floor(Math.random() * best.length)];
}

const MINIMAX_DEPTH = 2;

// new Board() は初期4石を置くため、全64マスを上書きして turn も合わせる
function cloneBoard(board: Board): Board {
  const clone = new Board();
  clone.rows.forEach((row, i) => {
    row.cells.forEach((cell, j) => {
      cell.state = board.rows[i].cells[j].state;
    });
  });
  clone.turn = board.turn;
  return clone;
}

// 位置重み。隅は返されない確定石なので最大、隅に隣接する C 打ち・X 打ちは
// 相手に隅を献上しやすいので負。辺はやや高い。8x8 の対称形
// prettier-ignore
const POSITION_WEIGHTS = [
  [120, -20,  20,   5,   5,  20, -20, 120],
  [-20, -40,  -5,  -5,  -5,  -5, -40, -20],
  [ 20,  -5,  15,   3,   3,  15,  -5,  20],
  [  5,  -5,   3,   3,   3,   3,  -5,   5],
  [  5,  -5,   3,   3,   3,   3,  -5,   5],
  [ 20,  -5,  15,   3,   3,  15,  -5,  20],
  [-20, -40,  -5,  -5,  -5,  -5, -40, -20],
  [120, -20,  20,   5,   5,  20, -20, 120],
];

// 着手可能数の差 1 手あたりの重み。隅(120)を上書きしない程度に効かせる
const MOBILITY_WEIGHT = 5;

// 石数差ではなく位置重みと着手可能数で評価する。序中盤の石数最大化は
// 相手の着手可能数を増やして終盤に返される悪手のため（#357）
function evaluate(board: Board, color: CellState): number {
  const opponent =
    color === CellState.Black ? CellState.White : CellState.Black;
  const myMobility = board.validMovesFor(color).length;
  const oppMobility = board.validMovesFor(opponent).length;

  // 終局はヒューリスティックではなく実際の石数勝敗で評価する。位置重みのままだと
  // 負ける終局を勝つ終局より高く評価し、読み切れる勝ちを捨てることがあるため
  if (myMobility === 0 && oppMobility === 0) {
    const mine = color === CellState.Black ? board.blacks : board.whites;
    const theirs = color === CellState.Black ? board.whites : board.blacks;
    // 位置重みの総和（最大でも千数百）を必ず上回る桁で勝敗を分離する
    return (mine - theirs) * 10_000;
  }

  let score = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const state = board.rows[y].cells[x].state;
      if (state === CellState.None) continue;
      score += state === color ? POSITION_WEIGHTS[y][x] : -POSITION_WEIGHTS[y][x];
    }
  }

  score += MOBILITY_WEIGHT * (myMobility - oppMobility);

  return score;
}

// Board.put() は強制パスを内部で処理するため、
// 着手後の clone.turn は常に正しい次手番を指す。
// 現在手番が置けない（passes）ケースだけ手動で next() する。
function minimax(
  board: Board,
  depth: number,
  color: CellState,
  alpha: number,
  beta: number,
): number {
  if (depth === 0) return evaluate(board, color);

  const moves = board.validMoves();

  if (moves.length === 0) {
    // 現在手番がパス。相手も置けなければゲーム終了
    const clone = cloneBoard(board);
    clone.next();
    if (clone.validMoves().length === 0) return evaluate(board, color);
    // パスは手数カウントを消費しない。探索深さを保ったまま次手番へ
    return minimax(clone, depth, color, alpha, beta);
  }

  const isMaximizing = board.turn === color;

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      const clone = cloneBoard(board);
      clone.put(move);
      best = Math.max(best, minimax(clone, depth - 1, color, alpha, beta));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = +Infinity;
    for (const move of moves) {
      const clone = cloneBoard(board);
      clone.put(move);
      best = Math.min(best, minimax(clone, depth - 1, color, alpha, beta));
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function selectMoveAdvanced(
  board: Board,
  color: CellState,
): Point | null {
  const moves = board.validMoves();
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const clone = cloneBoard(board);
    clone.put(move);
    const score = minimax(
      clone,
      MINIMAX_DEPTH - 1,
      color,
      -Infinity,
      +Infinity,
    );
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}
