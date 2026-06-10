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
