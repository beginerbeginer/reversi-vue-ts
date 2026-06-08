import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";
import { selectMove } from "@/models/cpu";

describe("初級CPU selectMove", () => {
  it("有効手が複数あるとき、そのうちの1つを返す", () => {
    const board = new Board();
    const move = selectMove(board, CellState.Black);
    expect(move).not.toBeNull();
  });

  it("返した手は必ず有効な手である", () => {
    const board = new Board();
    const move = selectMove(board, CellState.Black);
    expect(board.search(move!).length).toBeGreaterThan(0);
  });

  it("有効手がないとき null を返す", () => {
    const board = new Board();
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    const move = selectMove(board, CellState.White);
    expect(move).toBeNull();
  });
});
