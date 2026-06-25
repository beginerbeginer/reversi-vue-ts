import { describe, it, expect } from "vitest";
import { Board, CellState, Point } from "@/models/reversi";
import { selectMoveBeginner } from "@/models/cpu";

type SelectFn = (board: Board, color: CellState) => Point | null;

// 2 つの CPU 関数で 1 ゲームを完全シミュレートして勝者を返す自己対戦ヘルパ。
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

// 勝率の測定ではなく、自己対戦ループが不正な CPU を確実に検出することを保証する。
// 不正手・不正パスを見逃すと、将来 CPU を増やしたとき強さ測定が静かに壊れるため
describe("自己対戦ヘルパ playGame の不正手検出", () => {
  it("CPU が無効手を返したときエラーをスローする", () => {
    // Point(0,0) は初期盤面で search が空配列を返す無効手。
    // board.put() が no-op になり passes がリセットされ続けると無限ループになるため
    const badCpu: SelectFn = () => new Point(0, 0);
    expect(() => playGame(badCpu, selectMoveBeginner)).toThrow(
      "CPU が無効手を返した",
    );
  }, 1000);

  it("合法手があるのに null を返した CPU に対してエラーをスローする", () => {
    // 合法手があるのに null を返す CPU はバグ。不正パスとして進めると
    // 強さ測定が誤った値になるため即エラーにする
    const nullCpu: SelectFn = () => null;
    expect(() => playGame(nullCpu, selectMoveBeginner)).toThrow(
      "CPU が合法手があるのに null を返した",
    );
  }, 1000);
});
