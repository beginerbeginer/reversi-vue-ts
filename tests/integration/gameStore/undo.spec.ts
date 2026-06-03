import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";

describe("gameStore / 待った（undo）", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("3手打った後に3回 undo すると初期状態に戻る", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });

    const initialBlacks = store.board.blacks;
    const initialWhites = store.board.whites;
    const initialTurn = store.board.turn;

    for (let i = 0; i < 3; i++) {
      const move = store.validMoves[0];
      store.put(move.x, move.y);
    }

    store.undo();
    store.undo();
    store.undo();

    expect(store.board.blacks).toBe(initialBlacks);
    expect(store.board.whites).toBe(initialWhites);
    expect(store.board.turn).toBe(initialTurn);
    expect(store.canUndo).toBe(false);
  });

  it("2手打って2回 undo した後、再度同じ手を打つと同じ盤面になる", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });

    const firstMove = store.validMoves[0];
    store.put(firstMove.x, firstMove.y);
    const secondMove = store.validMoves[0];
    store.put(secondMove.x, secondMove.y);

    const blacksAfter2 = store.board.blacks;
    const whitesAfter2 = store.board.whites;

    store.undo();
    store.undo();

    // 同じ手順を再度打つ
    store.put(firstMove.x, firstMove.y);
    store.put(secondMove.x, secondMove.y);

    expect(store.board.blacks).toBe(blacksAfter2);
    expect(store.board.whites).toBe(whitesAfter2);
  });

  it("5手打って undo を繰り返すと履歴が順に減る", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });

    for (let i = 0; i < 5; i++) {
      if (store.validMoves.length === 0) break;
      store.put(store.validMoves[0].x, store.validMoves[0].y);
    }

    for (let remaining = 4; remaining >= 0; remaining--) {
      expect(store.canUndo).toBe(true);
      store.undo();
    }
    expect(store.canUndo).toBe(false);
  });
});
