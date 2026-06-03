import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";

describe("Board / validMoves()", () => {
  it("初期状態で黒の有効手は4マスある", () => {
    const board = new Board();
    expect(board.validMoves()).toHaveLength(4);
  });

  it("初期状態の黒の有効手に (3,2) が含まれる", () => {
    const board = new Board();
    const moves = board.validMoves();
    expect(moves.some((p) => p.x === 3 && p.y === 2)).toBe(true);
  });

  it("全マスが埋まっているとき有効手は0個", () => {
    const board = new Board();
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    expect(board.validMoves()).toHaveLength(0);
  });
});
