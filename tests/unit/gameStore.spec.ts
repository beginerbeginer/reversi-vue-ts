import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("useGameStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("初期状態で黒が2個ある", () => {
    const store = useGameStore();
    expect(store.board.blacks).toBe(2);
  });

  it("黒が最初の手番である", () => {
    const store = useGameStore();
    expect(store.current).toBe("黒の手番");
  });

  it("put を呼ぶと石が置かれて手番が切り替わる", () => {
    const store = useGameStore();
    store.put(3, 2);
    expect(store.current).toBe("白の手番");
  });

  describe("isGameOver / winner", () => {
    it("初期状態ではゲームオーバーでない", () => {
      const store = useGameStore();
      expect(store.isGameOver).toBe(false);
    });

    it("両者ともパスになるとゲームオーバーになる", () => {
      const store = useGameStore();
      // 全マスを黒で埋める（どちらも置けない）
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      expect(store.isGameOver).toBe(true);
    });

    it("黒が多いとき黒の勝ち", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      expect(store.winner).toBe(CellState.Black);
    });

    it("白が多いとき白の勝ち", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.White)),
      );
      expect(store.winner).toBe(CellState.White);
    });

    it("同数のとき引き分け（null）", () => {
      const store = useGameStore();
      // 32マスを黒、32マスを白で埋める
      let count = 0;
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => {
          cell.state = count++ < 32 ? CellState.Black : CellState.White;
        }),
      );
      expect(store.winner).toBeNull();
    });
  });

  describe("lastPassed", () => {
    it("初期状態では null", () => {
      const store = useGameStore();
      expect(store.lastPassed).toBeNull();
    });

    it("パスが発生しない通常の手では null のまま", () => {
      const store = useGameStore();
      store.put(3, 2);
      expect(store.lastPassed).toBeNull();
    });

    it("オートパスが発生したとき、パスされた側の色が入る", () => {
      const store = useGameStore();
      // 黒が (0,0) に置いたら白がパスになる盤面を作る
      // 全マス黒で埋めて (0,0) だけ空け、(1,0) を白にする
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.turn = CellState.Black;

      store.put(0, 0); // 黒が (0,0) に置く → (1,0) が反転 → 白は置く場所がなくパス

      expect(store.lastPassed).toBe(CellState.White);
    });
  });
});
