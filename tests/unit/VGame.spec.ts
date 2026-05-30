import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";
import VGame from "@/components/reversi/VGame.vue";

const mockConfetti = vi.hoisted(() => vi.fn());
vi.mock("canvas-confetti", () => ({ default: mockConfetti }));

const vuetify = createVuetify();

describe("VGame", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockConfetti.mockClear();
    mount(VGame, { global: { plugins: [vuetify] } });
  });

  it("ゲームが終了して黒が勝った場合、confetti が呼ばれる", async () => {
    const store = useGameStore();
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(mockConfetti).toHaveBeenCalledOnce();
  });

  it("ゲームが終了して白が勝った場合、confetti が呼ばれる", async () => {
    const store = useGameStore();
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.White)),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(mockConfetti).toHaveBeenCalledOnce();
  });

  it("ゲームが終了していない状態では confetti が呼ばれない", async () => {
    await new Promise((r) => setTimeout(r, 0));

    expect(mockConfetti).not.toHaveBeenCalled();
  });

  it("引き分けの場合、confetti が呼ばれない", async () => {
    const store = useGameStore();
    let count = 0;
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => {
        cell.state = count++ < 32 ? CellState.Black : CellState.White;
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(mockConfetti).not.toHaveBeenCalled();
  });
});
