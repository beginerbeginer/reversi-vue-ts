import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import VCell from "@/components/reversi/VCell.vue";
import { Cell, CellState } from "@/models/reversi";
import { useGameStore } from "@/stores/game";

describe("VCell", () => {
  // 表示系は isValid を props で受け取るため store のセットアップが不要
  it("石がないセルは white-stone / black-stone クラスを持たない", () => {
    const cell = new Cell(0, 0);
    const wrapper = mount(VCell, { props: { cell, isValid: false } });
    expect(wrapper.find(".white-stone").exists()).toBe(false);
    expect(wrapper.find(".black-stone").exists()).toBe(false);
  });

  it("白石のセルは white-stone クラスを持つ", () => {
    const cell = new Cell(0, 0);
    cell.state = CellState.White;
    const wrapper = mount(VCell, { props: { cell, isValid: false } });
    expect(wrapper.find(".white-stone").exists()).toBe(true);
  });

  it("黒石のセルは black-stone クラスを持つ", () => {
    const cell = new Cell(0, 0);
    cell.state = CellState.Black;
    const wrapper = mount(VCell, { props: { cell, isValid: false } });
    expect(wrapper.find(".black-stone").exists()).toBe(true);
  });

  describe("有効手の操作", () => {
    // put はストアのアクションを直接呼ぶ設計のため、click 系のみ pinia が要る
    beforeEach(() => {
      setActivePinia(createPinia());
    });

    it("クリックするとストアの put が正しい座標で呼ばれる", async () => {
      const store = useGameStore();
      const initialBlacks = store.board.blacks;
      const cell = new Cell(3, 2);
      const wrapper = mount(VCell, { props: { cell, isValid: true } });
      await wrapper.find(".cell-wrapper").trigger("click");
      expect(store.board.blacks).not.toBe(initialBlacks);
    });

    it("Enter キーで put が呼ばれる", async () => {
      const store = useGameStore();
      const initialBlacks = store.board.blacks;
      const cell = new Cell(3, 2);
      const wrapper = mount(VCell, { props: { cell, isValid: true } });
      await wrapper.find(".cell-wrapper").trigger("keydown.enter");
      expect(store.board.blacks).not.toBe(initialBlacks);
    });

    it("Space キーで put が呼ばれる", async () => {
      const store = useGameStore();
      const initialBlacks = store.board.blacks;
      const cell = new Cell(3, 2);
      const wrapper = mount(VCell, { props: { cell, isValid: true } });
      await wrapper.find(".cell-wrapper").trigger("keydown.space");
      expect(store.board.blacks).not.toBe(initialBlacks);
    });
  });

  describe("アクセシビリティ", () => {
    // isValid を props で受け取るため store セットアップは不要
    it("有効な手のマス（isValid=true）は <button> 要素でレンダリングされる", () => {
      const cell = new Cell(3, 2);
      const wrapper = mount(VCell, { props: { cell, isValid: true } });
      expect(wrapper.find("button.cell-wrapper").exists()).toBe(true);
    });

    it("有効な手のマスの aria-label は '座標 置けます'", () => {
      const cell = new Cell(3, 2); // (3,2) → 表示は 4,3
      const wrapper = mount(VCell, { props: { cell, isValid: true } });
      expect(wrapper.find("button.cell-wrapper").attributes("aria-label")).toBe(
        "4,3 置けます",
      );
    });

    it("黒石のセルは role='img' の <div> でレンダリングされる", () => {
      const cell = new Cell(0, 0);
      cell.state = CellState.Black;
      const wrapper = mount(VCell, { props: { cell, isValid: false } });
      expect(wrapper.find("div.cell-wrapper").attributes("role")).toBe("img");
    });

    it("置けない空きマスは role 属性なし・aria-label なしの <div>", () => {
      const cell = new Cell(0, 0);
      const wrapper = mount(VCell, { props: { cell, isValid: false } });
      const el = wrapper.find("div.cell-wrapper");
      expect(el.attributes("role")).toBeUndefined();
      expect(el.attributes("aria-label")).toBeUndefined();
    });

    it("黒石のセルの aria-label は '座標 黒の石'", () => {
      const cell = new Cell(2, 3);
      cell.state = CellState.Black;
      const wrapper = mount(VCell, { props: { cell, isValid: false } });
      expect(wrapper.find(".cell-wrapper").attributes("aria-label")).toBe(
        "3,4 黒の石",
      );
    });

    it("白石のセルの aria-label は '座標 白の石'", () => {
      const cell = new Cell(4, 5);
      cell.state = CellState.White;
      const wrapper = mount(VCell, { props: { cell, isValid: false } });
      expect(wrapper.find(".cell-wrapper").attributes("aria-label")).toBe(
        "5,6 白の石",
      );
    });

    it("空きセルは aria-label を持たない（非インタラクティブ）", () => {
      const cell = new Cell(0, 0);
      const wrapper = mount(VCell, { props: { cell, isValid: false } });
      expect(
        wrapper.find(".cell-wrapper").attributes("aria-label"),
      ).toBeUndefined();
    });
  });
});
