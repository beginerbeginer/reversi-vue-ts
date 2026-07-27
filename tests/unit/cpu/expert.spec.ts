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

describe("selectMoveExpert の時間制約", () => {
  // codex が #379 で報告した局面。深さ固定だと 95,917 ノードを評価し
  // 環境によっては 6.7 秒かかる。時間で打ち切れているかを確認する
  const HEAVY_LAYOUT = [
    ".......W",
    "BBBWWWWW",
    ".BBBW.BW",
    "..BWBWW.",
    ".BBBWWW.",
    "..WWBWWB",
    "...WWWWW",
    "..WWWWB.",
  ];

  it("重い局面でも制限時間内に着手する", () => {
    const board = new Board();
    setBoard(board, HEAVY_LAYOUT);
    board.turn = CellState.Black;

    const started = performance.now();
    const move = selectMoveExpert(board, CellState.Black);
    const elapsed = performance.now() - started;

    expect(move).not.toBeNull();
    // 制限は 1000ms。打ち切り判定の粒度ぶんの超過を見込んで 2 倍を上限にする
    expect(elapsed).toBeLessThan(2000);
  });

  it("制限時間を指定すると、それを超える前に打ち切る", () => {
    const board = new Board();
    setBoard(board, HEAVY_LAYOUT);
    board.turn = CellState.Black;

    const started = performance.now();
    const result = searchExpert(board, CellState.Black, { timeLimitMs: 100 });
    const elapsed = performance.now() - started;

    expect(result.move).not.toBeNull();
    expect(elapsed).toBeLessThan(1000);
  });
});
