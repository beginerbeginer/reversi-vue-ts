import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import VCell from "@/components/reversi/VCell.vue";
import { Cell, CellState } from "@/models/reversi";
import { useGameStore } from "@/stores/game";
import { useSettingsStore } from "@/stores/settings";

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
    it("有効な手のマスは <button> 要素でレンダリングされる", () => {
      const store = useGameStore();
      // (3,2) は初期盤面で黒の有効な手
      const cell = store.board.rows[2].cells[3];
      const wrapper = mount(VCell, { props: { cell } });
      expect(wrapper.find("button.cell-wrapper").exists()).toBe(true);
    });

    it("有効な手のマスの aria-label は '座標 置けます'", () => {
      const store = useGameStore();
      const cell = store.board.rows[2].cells[3]; // (3,2)
      const wrapper = mount(VCell, { props: { cell } });
      expect(wrapper.find("button.cell-wrapper").attributes("aria-label")).toBe(
        "4,3 置けます",
      );
    });

    it("黒石のセルは role='img' の <div> でレンダリングされる", () => {
      const cell = new Cell(0, 0);
      cell.state = CellState.Black;
      const wrapper = mount(VCell, { props: { cell } });
      const el = wrapper.find("div.cell-wrapper");
      expect(el.attributes("role")).toBe("img");
    });

    it("置けない空きマスは role 属性なし・aria-label なしの <div>", () => {
      const cell = new Cell(0, 0);
      const wrapper = mount(VCell, { props: { cell } });
      const el = wrapper.find("div.cell-wrapper");
      expect(el.attributes("role")).toBeUndefined();
      expect(el.attributes("aria-label")).toBeUndefined();
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

    it("空きセルは aria-label を持たない（非インタラクティブ）", () => {
      const cell = new Cell(0, 0);
      const wrapper = mount(VCell, { props: { cell } });
      expect(
        wrapper.find(".cell-wrapper").attributes("aria-label"),
      ).toBeUndefined();
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

  describe("ホバープレビュー", () => {
    it("hoverPreview OFF のとき .hover-preview は存在しない", () => {
      const store = useGameStore();
      const settings = useSettingsStore();
      settings.hoverPreview = false;
      const cell = store.board.rows[2].cells[3]; // 有効な手
      const wrapper = mount(VCell, { props: { cell } });
      expect(wrapper.find(".hover-preview").exists()).toBe(false);
    });

    it("hoverPreview ON のとき有効セルに .hover-preview が存在する", () => {
      const store = useGameStore();
      const settings = useSettingsStore();
      settings.hoverPreview = true;
      const cell = store.board.rows[2].cells[3]; // 有効な手
      const wrapper = mount(VCell, { props: { cell } });
      expect(wrapper.find(".hover-preview").exists()).toBe(true);
    });

    it("黒番のとき hover-preview--black クラスが付く", () => {
      const store = useGameStore();
      const settings = useSettingsStore();
      settings.hoverPreview = true;
      const cell = store.board.rows[2].cells[3];
      const wrapper = mount(VCell, { props: { cell } });
      expect(store.board.turn).toBe(CellState.Black);
      expect(wrapper.find(".hover-preview--black").exists()).toBe(true);
      expect(wrapper.find(".hover-preview--white").exists()).toBe(false);
    });
  });
});
