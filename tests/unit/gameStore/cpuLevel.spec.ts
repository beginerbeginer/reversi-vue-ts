import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import * as cpu from "@/models/cpu";

describe("useGameStore / CPU レベルの選択", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // レベルごとに対応する selectMove が呼ばれることを確認する。
  // 盤面の結果ではレベルを判別できないため、呼び出し自体を観測する
  const levels = [
    { level: "beginner", fn: "selectMoveBeginner" },
    { level: "intermediate", fn: "selectMoveIntermediate" },
    { level: "advanced", fn: "selectMoveAdvanced" },
    { level: "expert", fn: "selectMoveExpert" },
  ] as const;

  levels.forEach(({ level, fn }) => {
    it(`cpuLevel: ${level} では ${fn} が使われる`, async () => {
      const spy = vi.spyOn(cpu, fn);
      const store = useGameStore();
      store.startGame({
        allowUndo: false,
        gameMode: "cpu",
        playerColor: "black",
        cpuLevel: level,
      });

      store.put(3, 2);
      await vi.advanceTimersByTimeAsync(500);

      expect(spy).toHaveBeenCalled();
    });
  });
});
