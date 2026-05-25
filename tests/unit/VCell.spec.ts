import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import VCell from "@/components/reversi/VCell.vue";
import { Cell, CellState } from "@/models/reversi";
import { useGameStore } from "@/stores/game";

describe("VCell", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("石がないセルは white-stone / black-stone クラスを持たない", () => {
    const cell = new Cell(0, 0);
    const wrapper = mount(VCell, { props: { cell } });
    expect(wrapper.find(".white-stone").exists()).toBe(false);
    expect(wrapper.find(".black-stone").exists()).toBe(false);
  });

  it("白石のセルは white-stone クラスを持つ", () => {
    const cell = new Cell(0, 0);
    cell.state = CellState.White;
    const wrapper = mount(VCell, { props: { cell } });
    expect(wrapper.find(".white-stone").exists()).toBe(true);
  });

  it("黒石のセルは black-stone クラスを持つ", () => {
    const cell = new Cell(0, 0);
    cell.state = CellState.Black;
    const wrapper = mount(VCell, { props: { cell } });
    expect(wrapper.find(".black-stone").exists()).toBe(true);
  });

  it("クリックするとストアの put が正しい座標で呼ばれる", async () => {
    const store = useGameStore();
    const initialBlacks = store.board.blacks;
    const cell = new Cell(3, 2);
    const wrapper = mount(VCell, { props: { cell } });
    await wrapper.find(".cell-wrapper").trigger("click");
    expect(store.board.blacks).not.toBe(initialBlacks);
  });
});
