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

// 超上級の探索深さの上限。時間内に届かなければ反復深化が浅い結果で打ち切るので、
// これは「最大でここまで」を表すだけで所要時間の保証ではない
const EXPERT_DEPTH = 5;

// 思考時間の上限。着手までの体感は cpuTurn の演出待ち 500ms との合計になるため、
// 「3 秒以内に着手する」要件に対して余裕を持たせている。
// 深さで時間を守ろうとすると局面次第で数秒かかる（#379）
const EXPERT_TIME_LIMIT_MS = 1000;

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

// 探索の内部状態。評価したノード数を数えて枝刈りの効きをテストから観測できるようにする
interface SearchContext {
  color: CellState;
  pruning: boolean;
  evaluatedNodes: number;
  // 打ち切り時刻（performance.now() 基準）。Infinity なら無制限
  deadline: number;
  aborted: boolean;
}

// 打ち切り判定は「評価した末端の数」を目安に間引く。ノードごとに
// performance.now() を呼ぶとその計測自体が探索より重くなるため
const DEADLINE_CHECK_INTERVAL = 512;

function isPastDeadline(ctx: SearchContext): boolean {
  if (ctx.aborted) return true;
  if (ctx.deadline === Infinity) return false;
  if (ctx.evaluatedNodes % DEADLINE_CHECK_INTERVAL !== 0) return false;
  if (performance.now() >= ctx.deadline) {
    ctx.aborted = true;
    return true;
  }
  return false;
}

// Board.put() は強制パスを内部で処理するため、
// 着手後の clone.turn は常に正しい次手番を指す。
// 現在手番が置けない（passes）ケースだけ手動で next() する。
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  ctx: SearchContext,
): number {
  if (depth === 0) {
    ctx.evaluatedNodes++;
    return evaluate(board, ctx.color);
  }

  const moves = board.validMoves();

  if (moves.length === 0) {
    // 現在手番がパス。相手も置けなければゲーム終了
    const clone = cloneBoard(board);
    clone.next();
    if (clone.validMoves().length === 0) {
      ctx.evaluatedNodes++;
      return evaluate(board, ctx.color);
    }
    // パスは手数カウントを消費しない。探索深さを保ったまま次手番へ
    return minimax(clone, depth, alpha, beta, ctx);
  }

  const isMaximizing = board.turn === ctx.color;

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      const clone = cloneBoard(board);
      clone.put(move);
      best = Math.max(best, minimax(clone, depth - 1, alpha, beta, ctx));
      alpha = Math.max(alpha, best);
      if (ctx.pruning && beta <= alpha) break;
      if (isPastDeadline(ctx)) break;
    }
    return best;
  } else {
    let best = +Infinity;
    for (const move of moves) {
      const clone = cloneBoard(board);
      clone.put(move);
      best = Math.min(best, minimax(clone, depth - 1, alpha, beta, ctx));
      beta = Math.min(beta, best);
      if (ctx.pruning && beta <= alpha) break;
      if (isPastDeadline(ctx)) break;
    }
    return best;
  }
}

export interface AdvancedSearchResult {
  move: Point | null;
  evaluatedNodes: number;
}

// 指定された深さで一度だけ探索する
function searchAtDepth(
  board: Board,
  moves: Point[],
  depth: number,
  ctx: SearchContext,
): Point {
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const clone = cloneBoard(board);
    clone.put(move);
    // 確定済みの bestScore を alpha として渡す。フルウィンドウのままだと
    // 子ノードで beta <= alpha が成立せず枝刈りが一度も発動しない（#365）
    const score = minimax(
      clone,
      depth - 1,
      ctx.pruning ? bestScore : -Infinity,
      +Infinity,
      ctx,
    );
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    if (isPastDeadline(ctx)) break;
  }
  return bestMove;
}

// 探索結果と統計を返す。呼び出し側は手だけを使うが、枝刈りの効きや
// 探索の深さはノード数でしか観測できないため分けている。
//
// 深さ 1 から maxDepth まで一段ずつ深くする（反復深化）。深さを固定して
// 時間内に収まることを期待すると、局面によっては数秒かかり UI が固まる。
// 浅い探索の結果を捨てずに持っておけば、途中で時間切れになっても
// 「そこまでに読めた最善手」を返せる（#379）
function search(
  board: Board,
  color: CellState,
  maxDepth: number,
  options: { pruning?: boolean; timeLimitMs?: number } = {},
): AdvancedSearchResult {
  const ctx: SearchContext = {
    color,
    pruning: options.pruning ?? true,
    evaluatedNodes: 0,
    deadline:
      options.timeLimitMs === undefined
        ? Infinity
        : performance.now() + options.timeLimitMs,
    aborted: false,
  };

  const moves = board.validMoves();
  if (moves.length === 0) return { move: null, evaluatedNodes: 0 };

  let bestMove = moves[0];
  for (let depth = 1; depth <= maxDepth; depth++) {
    const move = searchAtDepth(board, moves, depth, ctx);
    // 打ち切られた深さの結果は全候補を見ていないので採用しない
    if (ctx.aborted) break;
    bestMove = move;
  }
  return { move: bestMove, evaluatedNodes: ctx.evaluatedNodes };
}

export function searchAdvanced(
  board: Board,
  color: CellState,
  options: { pruning?: boolean } = {},
): AdvancedSearchResult {
  return search(board, color, MINIMAX_DEPTH, options);
}

export function selectMoveAdvanced(
  board: Board,
  color: CellState,
): Point | null {
  return searchAdvanced(board, color).move;
}

export function searchExpert(
  board: Board,
  color: CellState,
  options: { pruning?: boolean; timeLimitMs?: number } = {},
): AdvancedSearchResult {
  return search(board, color, EXPERT_DEPTH, {
    ...options,
    timeLimitMs: options.timeLimitMs ?? EXPERT_TIME_LIMIT_MS,
  });
}

export function selectMoveExpert(
  board: Board,
  color: CellState,
): Point | null {
  return searchExpert(board, color).move;
}
