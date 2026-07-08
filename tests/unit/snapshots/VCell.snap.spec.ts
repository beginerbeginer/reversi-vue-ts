import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import VCell from "@/components/reversi/VCell.vue";
import { Cell, CellState } from "@/models/reversi";

describe("VCell スナップショット", () => {
  // isValid を props で受け取るため store のセットアップが不要
  it("空きセルの HTML が変わらない", () => {
    const cell = new Cell(0, 0);
    const wrapper = mount(VCell, { props: { cell, isValid: false } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("黒石セルの HTML が変わらない", () => {
    const cell = new Cell(3, 4);
    cell.state = CellState.Black;
    const wrapper = mount(VCell, { props: { cell, isValid: false } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("白石セルの HTML が変わらない", () => {
    const cell = new Cell(4, 3);
    cell.state = CellState.White;
    const wrapper = mount(VCell, { props: { cell, isValid: false } });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
