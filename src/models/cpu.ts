import { Board, CellState, Point } from "@/models/reversi";

export function selectMove(board: Board, color: CellState): Point | null {
  const moves = board.validMoves();
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}
