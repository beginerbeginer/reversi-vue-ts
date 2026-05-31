import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { nextTick } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import VGame from "@/components/reversi/VGame.vue";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

// jsdom は <canvas> を実装しないため canvas-confetti をモックする。
// npm install canvas で解決する方法もあるが、テスト目的で重い依存を追加するコストに見合わない。
vi.mock("canvas-confetti");

const vuetify = createVuetify();

function fillBoard(
  store: ReturnType<typeof useGameStore>,
  state: CellState,
): void {
  store.board.rows.forEach((row) =>
    row.cells.forEach((cell) => (cell.state = state)),
  );
}

describe("VGame", () => {
  let wrapper: ReturnType<typeof mount>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    setActivePinia(createPinia());
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: {} },
        { path: "/game", component: VGame },
      ],
    });
    wrapper = mount(VGame, {
      global: { plugins: [vuetify, router] },
      attachTo: document.body,
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe("手番・スコア表示", () => {
    it("初期状態で「黒の手番」が表示される", () => {
      expect(wrapper.text()).toContain("黒の手番");
    });

    it("石を置いた後「白の手番」に切り替わる", async () => {
      const store = useGameStore();
      store.put(3, 2);
      await nextTick();
      expect(wrapper.text()).toContain("白の手番");
    });

    it("初期状態で白2個・黒2個のスコアが表示される", () => {
      expect(wrapper.text()).toContain("白の石：2");
      expect(wrapper.text()).toContain("黒の石：2");
    });

    it("石を置いた後スコアが更新される", async () => {
      const store = useGameStore();
      // (3,2) に黒を置く → (3,3) の白が黒に反転 → 黒4・白1
      store.put(3, 2);
      await nextTick();
      expect(wrapper.text()).toContain("黒の石：4");
      expect(wrapper.text()).toContain("白の石：1");
    });
  });

  describe("ゲーム終了ダイアログ", () => {
    it("ゲームオーバー時に「ゲーム終了」ダイアログが表示される", async () => {
      const store = useGameStore();
      fillBoard(store, CellState.Black);
      await nextTick();
      expect(document.body.textContent).toContain("ゲーム終了");
    });

    it("黒が多いとき「黒の勝ち」が表示される", async () => {
      const store = useGameStore();
      fillBoard(store, CellState.Black);
      await nextTick();
      expect(document.body.textContent).toContain("黒の勝ち");
    });

    it("白が多いとき「白の勝ち」が表示される", async () => {
      const store = useGameStore();
      fillBoard(store, CellState.White);
      await nextTick();
      expect(document.body.textContent).toContain("白の勝ち");
    });

    it("黒32・白32のとき「引き分け」が表示される", async () => {
      const store = useGameStore();
      let count = 0;
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => {
          cell.state = count++ < 32 ? CellState.Black : CellState.White;
        }),
      );
      await nextTick();
      expect(document.body.textContent).toContain("引き分け");
    });

    it("「もう一度」ボタンでスタート画面（/）へ遷移する", async () => {
      const store = useGameStore();
      fillBoard(store, CellState.Black);
      await nextTick();

      const pushSpy = vi.spyOn(router, "push");
      const btn = document.body.querySelector<HTMLButtonElement>(
        ".v-overlay-container button",
      );
      btn?.click();
      await nextTick();

      expect(pushSpy).toHaveBeenCalledWith("/");
    });
  });

  describe("パス通知スナックバー", () => {
    it("パスが発生したとき「白はパスです」スナックバーが表示される", async () => {
      const store = useGameStore();
      // 全マス黒で埋め (0,0) のみ空き・(1,0) を白にして黒番にする
      // → 黒が (0,0) に置くと (1,0) が反転し白は置けずパスになる
      fillBoard(store, CellState.Black);
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.turn = CellState.Black;

      store.put(0, 0);
      await flushPromises();

      expect(document.body.textContent).toContain("白はパスです");
    });
  });
});
