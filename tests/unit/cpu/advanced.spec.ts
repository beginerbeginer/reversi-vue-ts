import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";
import { selectMoveAdvanced, selectMoveIntermediate } from "@/models/cpu";
import { setBoard } from "./board-layout";

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

  it("相手の応手を読み、即時フリップ最大の手より良い手を選ぶ", () => {
    // この盤面で黒の最大フリップ手は (6,5) の 4 石。貪欲な中級 CPU はこれを選ぶ。
    // 上級 CPU は 2 手先まで読み、(6,5) の後に白が大きく取り返す展開を避けて
    // 即時 2 石しか返さない (6,0) を選ぶ。先読み（ミニマックス）が効いている証拠。
    const layout = [
      ".BBBWW..",
      "...W..B.",
      "W.....W.",
      ".BBBB.W.",
      ".B.WWBWW",
      "...BBW..",
      "...W...B",
      ".BB.W..B",
    ];
    const board = new Board();
    setBoard(board, layout);
    board.turn = CellState.Black;

    const greedyMove = selectMoveIntermediate(board, CellState.Black);
    const advancedMove = selectMoveAdvanced(board, CellState.Black);

    // 中級が選ぶ最大フリップ手は (6,5)（候補が単一なので決定論的）
    expect(greedyMove).toMatchObject({ x: 6, y: 5 });
    expect(board.search(greedyMove!).length).toBe(4);

    // 上級は別の手を選び、即時フリップ数はより少ない
    expect(advancedMove).toMatchObject({ x: 6, y: 0 });
    expect(board.search(advancedMove!).length).toBeLessThan(
      board.search(greedyMove!).length,
    );
  });

  it("フリップ数が少なくても隅を取れるなら隅を選ぶ", () => {
    // 隅 (0,0) は 1 石、(2,2) は 2 石返せる。石数だけ見る評価では (2,2) を
    // 選んでしまうが、隅は相手にひっくり返されない確定石なので価値が高い。
    // 白の応手が小さい手しか無い盤面にして、応手の綾で結果が揺れないようにする
    const layout = [
      ".WB.....",
      "........",
      "...WWB..",
      "........",
      "......WB",
      "........",
      ".....WB.",
      "........",
    ];
    const board = new Board();
    setBoard(board, layout);
    board.turn = CellState.Black;

    expect(selectMoveIntermediate(board, CellState.Black)).toMatchObject({
      x: 2,
      y: 2,
    });
    expect(selectMoveAdvanced(board, CellState.Black)).toMatchObject({
      x: 0,
      y: 0,
    });
  });

  it("相手の着手可能数を抑える手を選ぶ", () => {
    // (2,4) を選ぶと白の応手は 2 手、位置重みだけなら選ばれる (4,5) だと
    // 7 手に広がる。相手の選択肢を奪うのはリバーシ序中盤の基本戦略で、
    // mobility 項が無いと石数・位置がほぼ同等の局面で判断できない
    const layout = [
      "........",
      "........",
      "..W...BW",
      "...BB...",
      "...BB...",
      "W..W.WBB",
      "..B.B...",
      "....B...",
    ];
    const board = new Board();
    setBoard(board, layout);
    board.turn = CellState.Black;

    expect(selectMoveAdvanced(board, CellState.Black)).toMatchObject({
      x: 2,
      y: 4,
    });
  });
});
