import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";
import { selectMoveAdvanced, selectMoveIntermediate } from "@/models/cpu";

// 文字列レイアウトから盤面を組む。B=黒 W=白 .=空
function setBoard(board: Board, layout: string[]): void {
  const map: Record<string, CellState> = {
    B: CellState.Black,
    W: CellState.White,
    ".": CellState.None,
  };
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      board.rows[y].cells[x].state = map[layout[y][x]];
    }
  }
}

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
});
