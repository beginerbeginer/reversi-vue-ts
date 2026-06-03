import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("useGameStore / isGameOver・winner", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

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
