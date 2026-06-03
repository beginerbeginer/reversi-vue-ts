import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("useGameStore / startGame・reset", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("startGame を呼ぶと石が初期配置に戻る", () => {
    const store = useGameStore();
    store.put(3, 2);
    store.startGame({ allowUndo: false });
    expect(store.board.blacks).toBe(2);
    expect(store.board.whites).toBe(2);
  });

  it("startGame を呼ぶと黒の手番に戻る", () => {
    const store = useGameStore();
    store.put(3, 2);
    store.startGame({ allowUndo: false });
    expect(store.current).toBe("黒の手番");
  });

  it("startGame を呼ぶと lastPassed が null になる", () => {
    const store = useGameStore();
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    store.board.rows[0].cells[0].state = CellState.None;
    store.board.rows[0].cells[1].state = CellState.White;
    store.board.turn = CellState.Black;
    store.put(0, 0);
    store.startGame({ allowUndo: false });
    expect(store.lastPassed).toBeNull();
  });

  it("startGame を呼ぶとゲームオーバーが解除される", () => {
    const store = useGameStore();
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    store.startGame({ allowUndo: false });
    expect(store.isGameOver).toBe(false);
  });

  it("startGame を呼ぶと盤面が初期状態（黒2・白2）に戻る", () => {
    const store = useGameStore();
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    store.startGame({ allowUndo: false });
    expect(store.board.blacks).toBe(2);
    expect(store.board.whites).toBe(2);
  });
});
