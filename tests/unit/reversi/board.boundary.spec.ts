import { describe, it, expect } from "vitest";
import { Board, CellState, Point } from "@/models/reversi";

const clearBoard = (board: Board) =>
  board.rows.forEach((row) =>
    row.cells.forEach((cell) => (cell.state = CellState.None)),
  );

describe("Board / 端・角への配置（境界エッジケース）", () => {
  it("左上角 (0,0) に石を置いたとき、右方向の石が正しく反転する", () => {
    const board = new Board();
    clearBoard(board);
    // (1,0)=White, (2,0)=Black → 黒で (0,0) に置くと (1,0) が反転
    board.rows[0].cells[1].state = CellState.White;
    board.rows[0].cells[2].state = CellState.Black;
    board.turn = CellState.Black;
    board.put(new Point(0, 0));
    expect(board.ref(new Point(0, 0)).isBlack).toBe(true);
    expect(board.ref(new Point(1, 0)).isBlack).toBe(true);
  });

  it("右上角 (7,0) に石を置いたとき、左方向の石が正しく反転する", () => {
    const board = new Board();
    clearBoard(board);
    // (6,0)=White, (5,0)=Black → 黒で (7,0) に置くと (6,0) が反転
    board.rows[0].cells[6].state = CellState.White;
    board.rows[0].cells[5].state = CellState.Black;
    board.turn = CellState.Black;
    board.put(new Point(7, 0));
    expect(board.ref(new Point(7, 0)).isBlack).toBe(true);
    expect(board.ref(new Point(6, 0)).isBlack).toBe(true);
  });

  it("左下角 (0,7) に石を置いたとき、上方向の石が正しく反転する", () => {
    const board = new Board();
    clearBoard(board);
    // (0,6)=White, (0,5)=Black → 黒で (0,7) に置くと (0,6) が反転
    board.rows[6].cells[0].state = CellState.White;
    board.rows[5].cells[0].state = CellState.Black;
    board.turn = CellState.Black;
    board.put(new Point(0, 7));
    expect(board.ref(new Point(0, 7)).isBlack).toBe(true);
    expect(board.ref(new Point(0, 6)).isBlack).toBe(true);
  });

  it("右下角 (7,7) に石を置いたとき、左方向の石が正しく反転する", () => {
    const board = new Board();
    clearBoard(board);
    // (6,7)=White, (5,7)=Black → 黒で (7,7) に置くと (6,7) が反転
    board.rows[7].cells[6].state = CellState.White;
    board.rows[7].cells[5].state = CellState.Black;
    board.turn = CellState.Black;
    board.put(new Point(7, 7));
    expect(board.ref(new Point(7, 7)).isBlack).toBe(true);
    expect(board.ref(new Point(6, 7)).isBlack).toBe(true);
  });

  it("上端 (y=0) の辺に置くとき、盤外（y=-1）方向を探索しない", () => {
    const board = new Board();
    clearBoard(board);
    // (3,0) に置く: 下方向 (3,1)=White → (3,2)=Black のみ有効
    board.rows[1].cells[3].state = CellState.White;
    board.rows[2].cells[3].state = CellState.Black;
    board.turn = CellState.Black;
    const result = board.search(new Point(3, 0));
    expect(result).toEqual([expect.objectContaining({ x: 3, y: 1 })]);
  });

  it("下端 (y=7) の辺に置くとき、盤外（y=8）方向を探索しない", () => {
    const board = new Board();
    clearBoard(board);
    // (3,7) に置く: 上方向 (3,6)=White → (3,5)=Black のみ有効
    board.rows[6].cells[3].state = CellState.White;
    board.rows[5].cells[3].state = CellState.Black;
    board.turn = CellState.Black;
    const result = board.search(new Point(3, 7));
    expect(result).toEqual([expect.objectContaining({ x: 3, y: 6 })]);
  });

  it("左端 (x=0) の辺に置くとき、盤外（x=-1）方向を探索しない", () => {
    const board = new Board();
    clearBoard(board);
    // (0,3) に置く: 右方向 (1,3)=White → (2,3)=Black のみ有効
    board.rows[3].cells[1].state = CellState.White;
    board.rows[3].cells[2].state = CellState.Black;
    board.turn = CellState.Black;
    const result = board.search(new Point(0, 3));
    expect(result).toEqual([expect.objectContaining({ x: 1, y: 3 })]);
  });

  it("右端 (x=7) の辺に置くとき、盤外（x=8）方向を探索しない", () => {
    const board = new Board();
    clearBoard(board);
    // (7,3) に置く: 左方向 (6,3)=White → (5,3)=Black のみ有効
    board.rows[3].cells[6].state = CellState.White;
    board.rows[3].cells[5].state = CellState.Black;
    board.turn = CellState.Black;
    const result = board.search(new Point(7, 3));
    expect(result).toEqual([expect.objectContaining({ x: 6, y: 3 })]);
  });
});
