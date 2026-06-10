import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Board, CellState, Point } from "@/models/reversi";
import { selectMoveBeginner, selectMoveIntermediate } from "@/models/cpu";

type SelectFn = (board: Board, color: CellState) => Point | null;

// 32-bit seed から決定論的な乱数列を生成する軽量 PRNG。
// テスト中の Math.random を差し替えることで結果を再現可能にするために使う
function mulberry32(seed: number): () => number {
  return () => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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
      // 合法手があるのに null を返すのは CPU のバグ。不正なゲームを進めると
      // 強さ測定が誤った値になるため、ここで即エラーにする
      if (board.validMoves().length > 0) {
        throw new Error(
          `CPU が合法手があるのに null を返した（合法手数: ${board.validMoves().length}）`,
        );
      }
      board.next();
      passes++;
    } else {
      const stonesBefore = board.blacks + board.whites;
      board.put(move);
      if (board.blacks + board.whites === stonesBefore) {
        throw new Error(`CPU が無効手を返した: (${move.x}, ${move.y})`);
      }
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
  beforeEach(() => {
    // seed=42 で固定して毎回同じゲーム展開にする。
    // Math.random をそのまま使うと統計的ばらつきで稀に閾値を下回り flaky になるため
    vi.spyOn(Math, "random").mockImplementation(mulberry32(42));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("playGame は CPU が無効手を返したときエラーをスローする", () => {
    // Point(0,0) は初期盤面で search が空配列を返す無効手。
    // board.put() が no-op になり passes がリセットされ続けると無限ループになるため
    const badCpu: SelectFn = () => new Point(0, 0);
    expect(() => playGame(badCpu, selectMoveBeginner)).toThrow(
      "CPU が無効手を返した",
    );
  }, 1000);

  it("playGame は合法手があるのに null を返した CPU に対してエラーをスローする", () => {
    // 合法手があるのに null を返す CPU はバグ。不正パスとして進めると
    // 強さ測定が誤った値になるため即エラーにする
    const nullCpu: SelectFn = () => null;
    expect(() => playGame(nullCpu, selectMoveBeginner)).toThrow(
      "CPU が合法手があるのに null を返した",
    );
  }, 1000);

  it("中級 CPU は初級 CPU に 400 戦中 55% 以上勝つ", () => {
    const winRate = measureWinRate(
      selectMoveIntermediate,
      selectMoveBeginner,
      200,
    );
    expect(winRate).toBeGreaterThan(0.55);
  }, 10_000);
});
