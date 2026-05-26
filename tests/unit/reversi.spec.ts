import { describe, it, expect } from "vitest";
import { Board, CellState, Point } from "@/models/reversi";

describe("Board", () => {
  it("初期状態で黒が2個ある", () => {
    const board = new Board();
    expect(board.blacks).toBe(2);
  });

  it("初期状態で白が2個ある", () => {
    const board = new Board();
    expect(board.whites).toBe(2);
  });

  it("黒が最初の手番である", () => {
    const board = new Board();
    expect(board.turn).toBe(CellState.Black);
  });

  it("有効な場所に石を置くと手番が切り替わる", () => {
    const board = new Board();
    board.put(new Point(3, 2));
    expect(board.turn).toBe(CellState.White);
  });

  it("有効な場所に石を置くと石数が増える", () => {
    const board = new Board();
    board.put(new Point(3, 2));
    expect(board.blacks).toBeGreaterThan(2);
  });
});
