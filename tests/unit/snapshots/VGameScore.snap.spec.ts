import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createVuetify } from "vuetify";
import VGameScore from "@/components/reversi/VGameScore.vue";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

const vuetify = createVuetify();

describe("VGameScore スナップショット", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("初期状態（黒2・白2）のスコア表示が変わらない", () => {
    const wrapper = mount(VGameScore, {
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });

  it("黒優勢のスコア表示が変わらない", () => {
    const store = useGameStore();
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    const wrapper = mount(VGameScore, {
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });
});
