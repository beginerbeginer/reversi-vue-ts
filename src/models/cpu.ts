import { Board, CellState, Point } from "@/models/reversi";

export function selectMoveBeginner(
  board: Board,
  color: CellState,
): Point | null {
  const moves = board.validMoves();
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

export function selectMoveIntermediate(
  board: Board,
  color: CellState,
): Point | null {
  const moves = board.validMoves();
  if (moves.length === 0) return null;
  return moves.reduce((best, p) =>
    board.search(p).length > board.search(best).length ? p : best,
  );
}
