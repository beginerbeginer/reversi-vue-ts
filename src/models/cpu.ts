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

function evaluate(board: Board, color: CellState): number {
  return color === CellState.Black
    ? board.blacks - board.whites
    : board.whites - board.blacks;
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
