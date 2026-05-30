import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { setActivePinia, createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";
import VGame from "@/components/reversi/VGame.vue";

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockConfetti = vi.hoisted(() => vi.fn());
vi.mock("canvas-confetti", () => ({ default: mockConfetti }));

const vuetify = createVuetify();

describe("VGame", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockConfetti.mockClear();
    mockPush.mockClear();
    mount(VGame, { global: { plugins: [vuetify] } });
  });

  describe("もう一度ボタン", () => {
    it("もう一度ボタンをクリックすると / に遷移する", async () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      mount(VGame, {
        attachTo: document.body,
        global: { plugins: [vuetify] },
      });
      await nextTick();
      await nextTick();
      const btn = document.querySelector(
        "[data-testid='retry-button']",
      ) as HTMLElement;
      btn.click();
      await nextTick();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("待ったボタン", () => {
    it("allowUndo: false のとき待ったボタンが表示されない", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: false });
      const wrapper = mount(VGame, { global: { plugins: [vuetify] } });
      expect(wrapper.find("[data-testid='undo-button']").exists()).toBe(false);
    });

    it("allowUndo: true のとき待ったボタンが表示される", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      const wrapper = mount(VGame, { global: { plugins: [vuetify] } });
      expect(wrapper.find("[data-testid='undo-button']").exists()).toBe(true);
    });

    it("allowUndo: true かつ canUndo: false のとき待ったボタンが disabled", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      const wrapper = mount(VGame, { global: { plugins: [vuetify] } });
      const btn = wrapper.find("[data-testid='undo-button']");
      expect(btn.attributes("disabled")).toBeDefined();
    });

    it("allowUndo: true かつ canUndo: true のとき待ったボタンをクリックで undo が呼ばれる", async () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(3, 2);
      const wrapper = mount(VGame, { global: { plugins: [vuetify] } });
      await wrapper.find("[data-testid='undo-button']").trigger("click");
      expect(store.canUndo).toBe(false); // undo 後は履歴が空
    });
  });

  it("ゲームが終了して黒が勝った場合、confetti が呼ばれる", async () => {
    const store = useGameStore();
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    await nextTick();

    expect(mockConfetti).toHaveBeenCalledOnce();
  });

  it("ゲームが終了して白が勝った場合、confetti が呼ばれる", async () => {
    const store = useGameStore();
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.White)),
    );
    await nextTick();

    expect(mockConfetti).toHaveBeenCalledOnce();
  });

  it("ゲームが終了していない状態では confetti が呼ばれない", async () => {
    await nextTick();

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
    await nextTick();

    expect(mockConfetti).not.toHaveBeenCalled();
  });
});
