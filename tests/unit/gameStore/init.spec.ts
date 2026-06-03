import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";

describe("useGameStore / 初期状態・基本操作", () => {
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
});
