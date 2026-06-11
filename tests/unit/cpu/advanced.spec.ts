import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";
import { selectMoveAdvanced } from "@/models/cpu";

describe("selectMoveAdvanced", () => {
  it("合法手がある → validMoves() に含まれる手を返す", () => {
    const board = new Board();
    const moves = board.validMoves();
    const result = selectMoveAdvanced(board, CellState.Black);
    expect(result).not.toBeNull();
    expect(moves.some((m) => m.x === result!.x && m.y === result!.y)).toBe(
      true,
    );
  });

  it("合法手がない → null を返す", () => {
    const board = new Board();
    // 全マスを黒で埋めると白は置けなくなる
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    board.turn = CellState.White;
    expect(selectMoveAdvanced(board, CellState.White)).toBeNull();
  });
});
