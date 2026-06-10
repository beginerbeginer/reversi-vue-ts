import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { createRouter, createMemoryHistory } from "vue-router";
import VMain from "@/components/VMain.vue";
import VGame from "@/components/reversi/VGame.vue";
import { useGameStore } from "@/stores/game";
import { routes } from "@/router/index";
import { CellState } from "@/models/reversi";

vi.mock("canvas-confetti");

const vuetify = createVuetify();

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes,
  });
}

describe("Router ナビゲーション", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("VMain → /game への遷移", () => {
    let wrapper: ReturnType<typeof mount>;
    let router: ReturnType<typeof makeRouter>;

    beforeEach(async () => {
      router = makeRouter();
      await router.push("/");
      await router.isReady();
      wrapper = mount(VMain, {
        global: { plugins: [vuetify, router] },
        attachTo: document.body,
      });
    });

    afterEach(() => wrapper.unmount());

    it("スタートボタンをクリックすると /game に遷移する", async () => {
      await wrapper.find("[data-testid='start-button']").trigger("click");
      await flushPromises();
      expect(router.currentRoute.value.path).toBe("/game");
    });

    it("遷移前に startGame が呼ばれる", async () => {
      const store = useGameStore();
      const spy = vi.spyOn(store, "startGame");
      await wrapper.find("[data-testid='start-button']").trigger("click");
      await flushPromises();
      expect(spy).toHaveBeenCalledOnce();
    });

    it("allowUndo チェックボックス ON でスタートすると allowUndo: true で startGame が呼ばれる", async () => {
      const store = useGameStore();
      const spy = vi.spyOn(store, "startGame");
      await wrapper
        .find("[data-testid='allow-undo-checkbox'] input")
        .setValue(true);
      await wrapper.find("[data-testid='start-button']").trigger("click");
      await flushPromises();
      expect(spy).toHaveBeenCalledWith({
        allowUndo: true,
        cpuLevel: "beginner",
        gameMode: "normal",
        playerColor: "black",
      });
    });
  });

  describe("VGame → / への遷移", () => {
    let wrapper: ReturnType<typeof mount>;
    let router: ReturnType<typeof makeRouter>;

    beforeEach(async () => {
      router = makeRouter();
      await router.push("/game");
      await router.isReady();
      wrapper = mount(VGame, {
        global: { plugins: [vuetify, router] },
        attachTo: document.body,
      });
    });

    afterEach(() => wrapper.unmount());

    it("ゲームオーバー時に「もう一度」ボタンをクリックすると router.push('/') が呼ばれる", async () => {
      const pushSpy = vi.spyOn(router, "push");
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      await flushPromises();

      const btn = document.body.querySelector<HTMLButtonElement>(
        "[data-testid='retry-button']",
      );
      btn?.click();
      await flushPromises();

      expect(pushSpy).toHaveBeenCalledWith("/");
    });
  });

  describe("直接アクセス", () => {
    it("/ に直接アクセスすると VMain が描画される", async () => {
      const router = makeRouter();
      await router.push("/");
      await router.isReady();
      const wrapper = mount(VMain, {
        global: { plugins: [vuetify, router] },
      });
      expect(wrapper.find("[data-testid='start-button']").exists()).toBe(true);
      wrapper.unmount();
    });

    it("/game に直接アクセスすると VGame が描画される", async () => {
      const router = makeRouter();
      await router.push("/game");
      await router.isReady();
      const wrapper = mount(VGame, {
        global: { plugins: [vuetify, router] },
        attachTo: document.body,
      });
      expect(wrapper.text()).toContain("黒の手番");
      wrapper.unmount();
    });
  });
});
