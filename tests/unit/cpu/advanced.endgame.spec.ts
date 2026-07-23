import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";
import { selectMoveAdvanced } from "@/models/cpu";
import { setBoard } from "./board-layout";

describe("selectMoveAdvanced 終局の読み", () => {
  it("読み切れる終局では位置重みより勝敗を優先する", () => {
    // 残り2マス。(2,7) なら白がパスして黒が最後も打ち勝てるが、
    // (5,4) は白に返されて負ける。終局を位置重みで評価すると
    // 負ける手が高く見えてしまう（#372 codex 指摘の盤面）
    const layout = [
      "BWWWWWWW",
      "BWWBWWWW",
      "BWBWBBBB",
      "BWBBWWWW",
      "BWBWW.WW",
      "BWBBWWWW",
      "BWBBBBBW",
      "WB.BWWWW",
    ];
    const board = new Board();
    setBoard(board, layout);
    board.turn = CellState.Black;

    expect(selectMoveAdvanced(board, CellState.Black)).toMatchObject({
      x: 2,
      y: 7,
    });
  });
});
