import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("useGameStore / lastPassed", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

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
    // (0,0)=空き、(0,1)=白、(0,2)=黒 → 黒は (0,0) に置ける
    // (0,3)=空き、(0,4)=白、(0,5)=黒 → put 後も黒は (0,3) に置けてゲームオーバーにならない
    // 残りはすべて黒
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    store.board.rows[0].cells[0].state = CellState.None;
    store.board.rows[0].cells[1].state = CellState.White;
    store.board.rows[0].cells[3].state = CellState.None;
    store.board.rows[0].cells[4].state = CellState.White;
    store.board.turn = CellState.Black;

    store.put(0, 0);

    expect(store.isGameOver).toBe(false);
    expect(store.lastPassed).toBe(CellState.White);
  });

  it("ゲームオーバーと同時にオートパスが発生しても lastPassed は null になる", () => {
    const store = useGameStore();
    // 全マス黒で埋め (0,0) だけ空け、(1,0) を白にする → ゲームオーバー
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    store.board.rows[0].cells[0].state = CellState.None;
    store.board.rows[0].cells[1].state = CellState.White;
    store.board.turn = CellState.Black;

    store.put(0, 0);

    expect(store.isGameOver).toBe(true);
    expect(store.lastPassed).toBeNull();
  });
});
