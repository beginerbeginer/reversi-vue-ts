import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { useGameStore } from "@/stores/game";
import VGameScore from "@/components/reversi/VGameScore.vue";

const vuetify = createVuetify();

describe("VGameScore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("待ったボタン", () => {
    it("allowUndo: false のとき待ったボタンが表示されない", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: false });
      const wrapper = mount(VGameScore, { global: { plugins: [vuetify] } });
      expect(wrapper.find("[data-testid='undo-button']").exists()).toBe(false);
    });

    it("allowUndo: true のとき待ったボタンが表示される", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      const wrapper = mount(VGameScore, { global: { plugins: [vuetify] } });
      expect(wrapper.find("[data-testid='undo-button']").exists()).toBe(true);
    });

    it("allowUndo: true かつ canUndo: false のとき待ったボタンが disabled", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      const wrapper = mount(VGameScore, { global: { plugins: [vuetify] } });
      expect(
        wrapper.find("[data-testid='undo-button']").attributes("disabled"),
      ).toBeDefined();
    });

    it("allowUndo: true かつ canUndo: true のとき待ったボタンをクリックで undo が呼ばれる", async () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(3, 2);
      const wrapper = mount(VGameScore, { global: { plugins: [vuetify] } });
      await wrapper.find("[data-testid='undo-button']").trigger("click");
      expect(store.canUndo).toBe(false);
    });
  });
});
