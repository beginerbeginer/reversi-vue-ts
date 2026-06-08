import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("useGameStore / CPU自動着手", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("cpu モードで put() すると人間の手の後に CPU が自動着手し石数が増える", () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "black",
    });
    const whitesBefore = store.board.whites;
    store.put(3, 2);
    expect(store.board.whites).toBeGreaterThan(whitesBefore);
  });

  it("CPU 着手後、手番が人間側（黒）に戻る", () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "black",
    });
    store.put(3, 2);
    expect(store.board.turn).toBe(CellState.Black);
  });

  it("normal モードでは put() 後に手番が白のまま（CPU は自動着手しない）", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: false, gameMode: "normal" });
    store.put(3, 2);
    expect(store.board.turn).toBe(CellState.White);
  });

  it("ゲームオーバー後は CPU の自動着手が実行されない", () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "black",
    });
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    store.board.rows[0].cells[0].state = CellState.None;
    store.board.rows[0].cells[1].state = CellState.White;
    store.board.turn = CellState.Black;
    const totalBefore = store.board.blacks + store.board.whites;
    store.put(0, 0);
    expect(store.isGameOver).toBe(true);
    expect(store.board.blacks + store.board.whites).toBe(totalBefore + 1);
  });
});
