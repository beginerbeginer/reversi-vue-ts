import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";
import { selectMoveAdvanced, searchAdvanced } from "@/models/cpu";
import { setBoard } from "./board-layout";

// 中盤の分岐が多い盤面。合法手が 1〜2 手しかないと枝刈りの効果を観測できない
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

describe("selectMoveAdvanced のαβ枝刈り", () => {
  it("枝刈りの有無で選ぶ手が変わらない", () => {
    const withPruning = searchAdvanced(midgameBoard(), CellState.Black);
    const withoutPruning = searchAdvanced(midgameBoard(), CellState.Black, {
      pruning: false,
    });

    expect(withPruning.move).toEqual(withoutPruning.move);
  });

  it("枝刈りが評価するノード数を減らす", () => {
    const withPruning = searchAdvanced(midgameBoard(), CellState.Black);
    const withoutPruning = searchAdvanced(midgameBoard(), CellState.Black, {
      pruning: false,
    });

    expect(withPruning.evaluatedNodes).toBeLessThan(
      withoutPruning.evaluatedNodes,
    );
  });

  it("selectMoveAdvanced は searchAdvanced と同じ手を返す", () => {
    expect(selectMoveAdvanced(midgameBoard(), CellState.Black)).toEqual(
      searchAdvanced(midgameBoard(), CellState.Black).move,
    );
  });
});
