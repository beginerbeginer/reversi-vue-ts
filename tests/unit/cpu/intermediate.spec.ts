import { describe, it, expect, vi } from "vitest";
import { Board, CellState } from "@/models/reversi";
import { selectMoveIntermediate } from "@/models/cpu";

describe("中級CPU selectMoveIntermediate", () => {
  it("有効手がないとき null を返す", () => {
    const board = new Board();
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    const move = selectMoveIntermediate(board, CellState.White);
    expect(move).toBeNull();
  });

  it("返した手は必ず有効な手である", () => {
    const board = new Board();
    const move = selectMoveIntermediate(board, CellState.Black);
    expect(board.search(move!).length).toBeGreaterThan(0);
  });

  it("最も多くの石をひっくり返せる手を選ぶ", () => {
    const board = new Board();
    const move = selectMoveIntermediate(board, CellState.Black);
    const flips = board.search(move!).length;
    const allMoves = board.validMoves();
    const maxFlips = Math.max(...allMoves.map((p) => board.search(p).length));
    expect(flips).toBe(maxFlips);
  });

  it("同点の手が複数あるとき、ランダムに1つを選ぶ", () => {
    // 初期盤面は全有効手が1石返しで同点
    const board = new Board();
    const allMoves = board.validMoves(); // 全候補は同点

    const spy = vi.spyOn(Math, "random");
    try {
      // 先頭候補が選ばれること
      spy.mockReturnValue(0);
      const moveFirst = selectMoveIntermediate(board, CellState.Black);
      expect(moveFirst).toEqual(allMoves[0]);

      // 末尾候補が選ばれること
      spy.mockReturnValue(1 - Number.EPSILON);
      const moveLast = selectMoveIntermediate(board, CellState.Black);
      expect(moveLast).toEqual(allMoves[allMoves.length - 1]);
    } finally {
      spy.mockRestore();
    }
  });
});
