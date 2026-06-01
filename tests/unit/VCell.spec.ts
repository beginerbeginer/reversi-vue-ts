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

  describe("アクセシビリティ", () => {
    it("cell-wrapper に role='button' と tabindex='0' が付いている", () => {
      const cell = new Cell(0, 0);
      const wrapper = mount(VCell, { props: { cell } });
      const el = wrapper.find(".cell-wrapper");
      expect(el.attributes("role")).toBe("button");
      expect(el.attributes("tabindex")).toBe("0");
    });

    it("黒石のセルの aria-label は '座標 黒の石'", () => {
      const cell = new Cell(2, 3);
      cell.state = CellState.Black;
      const wrapper = mount(VCell, { props: { cell } });
      expect(wrapper.find(".cell-wrapper").attributes("aria-label")).toBe(
        "3,4 黒の石",
      );
    });

    it("白石のセルの aria-label は '座標 白の石'", () => {
      const cell = new Cell(4, 5);
      cell.state = CellState.White;
      const wrapper = mount(VCell, { props: { cell } });
      expect(wrapper.find(".cell-wrapper").attributes("aria-label")).toBe(
        "5,6 白の石",
      );
    });

    it("空きセルの aria-label は '座標 空き'", () => {
      const cell = new Cell(0, 0);
      const wrapper = mount(VCell, { props: { cell } });
      expect(wrapper.find(".cell-wrapper").attributes("aria-label")).toContain(
        "空き",
      );
    });

    it("Enter キーで put が呼ばれる", async () => {
      const store = useGameStore();
      const initialBlacks = store.board.blacks;
      const cell = new Cell(3, 2);
      const wrapper = mount(VCell, { props: { cell } });
      await wrapper.find(".cell-wrapper").trigger("keydown.enter");
      expect(store.board.blacks).not.toBe(initialBlacks);
    });

    it("Space キーで put が呼ばれる", async () => {
      const store = useGameStore();
      const initialBlacks = store.board.blacks;
      const cell = new Cell(3, 2);
      const wrapper = mount(VCell, { props: { cell } });
      await wrapper.find(".cell-wrapper").trigger("keydown.space");
      expect(store.board.blacks).not.toBe(initialBlacks);
    });
  });
});
