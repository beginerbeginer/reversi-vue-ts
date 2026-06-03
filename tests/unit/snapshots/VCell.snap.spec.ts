import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import VCell from "@/components/reversi/VCell.vue";
import { Cell, CellState } from "@/models/reversi";

describe("VCell スナップショット", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("空きセルの HTML が変わらない", () => {
    const cell = new Cell(0, 0);
    const wrapper = mount(VCell, { props: { cell } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("黒石セルの HTML が変わらない", () => {
    const cell = new Cell(3, 2);
    cell.state = CellState.Black;
    const wrapper = mount(VCell, { props: { cell } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("白石セルの HTML が変わらない", () => {
    const cell = new Cell(4, 3);
    cell.state = CellState.White;
    const wrapper = mount(VCell, { props: { cell } });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
