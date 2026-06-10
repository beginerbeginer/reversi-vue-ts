import { describe, it, expect } from "vitest";
import { Board, CellState } from "@/models/reversi";
import type { Point } from "@/models/reversi";
import { selectMoveBeginner, selectMoveIntermediate } from "@/models/cpu";

type SelectFn = (board: Board, color: CellState) => Point | null;

// 2 つの CPU 関数で 1 ゲームを完全シミュレートして勝者を返す
// board.put() は「次の手番がパスになるケース」を内部で自動処理するため、
// このループでは「現在の手番が着手できない（CPU が null を返す）」場合のみ
// 手動でターンを切り替えて passes をカウントする
function playGame(black: SelectFn, white: SelectFn): CellState | null {
  const board = new Board();
  let passes = 0;

  while (passes < 2) {
    const player = board.turn === CellState.Black ? black : white;
    const move = player(board, board.turn);
    if (move === null) {
      board.next();
      passes++;
    } else {
      board.put(move);
      passes = 0;
    }
  }

  if (board.blacks > board.whites) return CellState.Black;
  if (board.whites > board.blacks) return CellState.White;
  return null;
}

// stronger を先手・後手の両方で games 回ずつ対戦させて勝率を返す
// 先手有利・後手不利のバイアスを相殺するため両方向で測定する
function measureWinRate(
  stronger: SelectFn,
  weaker: SelectFn,
  games: number,
): number {
  let wins = 0;
  for (let i = 0; i < games; i++) {
    if (playGame(stronger, weaker) === CellState.Black) wins++;
  }
  for (let i = 0; i < games; i++) {
    if (playGame(weaker, stronger) === CellState.White) wins++;
  }
  return wins / (games * 2);
}

describe("CPU 強さ評価（自己対戦テスト）", () => {
  // 200 戦 × 2 方向 = 400 戦で測定。
  // 貪欲法の実測勝率は約 60〜62%。閾値 0.55 は統計的に安定して超える値
  it("中級 CPU は初級 CPU に 400 戦中 55% 以上勝つ", () => {
    const winRate = measureWinRate(
      selectMoveIntermediate,
      selectMoveBeginner,
      200,
    );
    expect(winRate).toBeGreaterThan(0.55);
  });
});
