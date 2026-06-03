import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";

describe("Board / shouldPass()", () => {
  it("初期状態では黒はパスしない（有効な手が存在する）", () => {
    const board = new Board();
    expect(board.shouldPass()).toBe(false);
  });

  it("初期状態では白もパスしない（turn を切り替えて確認）", () => {
    const board = new Board();
    board.next();
    expect(board.shouldPass()).toBe(false);
  });

  it("全マスが黒石で埋まっているとき白手番ではパスになる", () => {
    const board = new Board();
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    board.turn = CellState.White;
    expect(board.shouldPass()).toBe(true);
  });

  it("全マスが白石で埋まっているとき黒手番ではパスになる", () => {
    const board = new Board();
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.White)),
    );
    board.turn = CellState.Black;
    expect(board.shouldPass()).toBe(true);
  });

  it("空きマスがあっても挟める相手石がなければパスになる", () => {
    const board = new Board();
    // 盤面を全部黒で埋めて1マスだけ空ける（黒手番では隣が全部黒なので挟めない）
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    board.rows[0].cells[0].state = CellState.None;
    board.turn = CellState.Black;
    expect(board.shouldPass()).toBe(true);
  });
});
