import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";

describe("useGameStore / allowUndo・undo", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("allowUndo のデフォルト値は false", () => {
    const store = useGameStore();
    expect(store.allowUndo).toBe(false);
  });

  it("startGame({ allowUndo: true }) を呼ぶと allowUndo が true になる", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    expect(store.allowUndo).toBe(true);
  });

  it("startGame({ allowUndo: false }) を呼ぶと allowUndo が false のまま", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: false });
    expect(store.allowUndo).toBe(false);
  });

  it("allowUndo: true のとき、startGame を呼ぶと canUndo が false になる", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    store.put(3, 2);
    store.startGame({ allowUndo: false });
    expect(store.canUndo).toBe(false);
  });

  it("allowUndo: false のとき、put 後も canUndo は false", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: false });
    store.put(3, 2);
    expect(store.canUndo).toBe(false);
  });

  it("allowUndo: true のとき、初期状態では canUndo は false", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    expect(store.canUndo).toBe(false);
  });

  it("allowUndo: true のとき、put 後に canUndo が true になる", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    store.put(3, 2);
    expect(store.canUndo).toBe(true);
  });

  it("allowUndo: true のとき、undo() を呼ぶと盤面が1手前に戻る", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    const blacksBefore = store.board.blacks;
    store.put(3, 2);
    store.undo();
    expect(store.board.blacks).toBe(blacksBefore);
  });

  it("allowUndo: true のとき、undo() を呼ぶと手番が1手前に戻る", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    store.put(3, 2); // 黒が打つ → 白の手番
    store.undo();
    expect(store.current).toBe("黒の手番");
  });

  it("allowUndo: true のとき、undo() 後に canUndo が false になる（履歴が空）", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    store.put(3, 2);
    store.undo();
    expect(store.canUndo).toBe(false);
  });

  it("allowUndo: true のとき、無効なマス（石が置けない）をクリックしても canUndo は false のまま", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    store.put(0, 0); // 初期盤面で (0,0) は置けない無効な手
    expect(store.canUndo).toBe(false);
  });

  it("allowUndo: true のとき、有効な手の後に無効なマスをクリックしても履歴は増えない", () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true });
    store.put(3, 2); // 有効な手
    store.put(0, 0); // 無効な手
    store.undo(); // 1回 undo
    expect(store.canUndo).toBe(false); // 履歴が空になっているはず
  });
});
