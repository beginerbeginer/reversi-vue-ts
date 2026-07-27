import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";
import { selectMoveExpert, searchExpert, searchAdvanced } from "@/models/cpu";
import { setBoard } from "./board-layout";

const MIDGAME_LAYOUT = [
  "........",
  "..W.....",
  "..WWB...",
  "..BWWB..",
  "...BBW..",
  "..B..W..",
  "........",
  "........",
];

function midgameBoard(): Board {
  const board = new Board();
  setBoard(board, MIDGAME_LAYOUT);
  board.turn = CellState.Black;
  return board;
}

describe("selectMoveExpert", () => {
  it("合法手がある → validMoves() に含まれる手を返す", () => {
    const board = new Board();
    const moves = board.validMoves();
    const result = selectMoveExpert(board, CellState.Black);
    expect(result).not.toBeNull();
    expect(moves.some((m) => m.x === result!.x && m.y === result!.y)).toBe(true);
  });

  it("合法手がない → null を返す", () => {
    const board = new Board();
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    board.turn = CellState.White;
    expect(selectMoveExpert(board, CellState.White)).toBeNull();
  });

  it("上級より深く読む", () => {
    // 深さの差は返り手からは判別できないため、評価ノード数で確認する。
    // 深いほど到達する末端が増えるので、超上級 > 上級 になる
    const expert = searchExpert(midgameBoard(), CellState.Black);
    const advanced = searchAdvanced(midgameBoard(), CellState.Black);

    expect(expert.evaluatedNodes).toBeGreaterThan(advanced.evaluatedNodes);
  });
});
