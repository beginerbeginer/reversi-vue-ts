import { describe, it, expect } from "vitest";
import { Board, CellState, Point } from "@/models/reversi";
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

  it("同点の手が複数あるとき、いずれかの有効な手を返す", () => {
    const board = new Board();
    const move = selectMoveIntermediate(board, CellState.Black);
    expect(move).not.toBeNull();
    expect(
      board.validMoves().some((p) => p.x === move!.x && p.y === move!.y),
    ).toBe(true);
  });
});
