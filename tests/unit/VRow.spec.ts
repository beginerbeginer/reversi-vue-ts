import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import VRow from "@/components/reversi/VRow.vue";
import { Row, Point } from "@/models/reversi";

describe("VRow", () => {
  // validMoves を props で受け取り各 VCell の isValid を算出するため store 不要
  it("row の cells の数だけ VCell が描画される", () => {
    const row = new Row(0);
    const wrapper = mount(VRow, { props: { row, validMoves: [] } });
    expect(wrapper.findAll(".cell-wrapper").length).toBe(8);
  });

  it("validMoves に含まれるセルだけ button（有効手）になる", () => {
    const row = new Row(0);
    // (2,0) と (5,0) を有効手として渡す
    const validMoves = [new Point(2, 0), new Point(5, 0)];
    const wrapper = mount(VRow, { props: { row, validMoves } });
    const buttons = wrapper.findAll("button.cell-wrapper");
    expect(buttons.length).toBe(2);
  });

  it("validMoves が空なら button は 0 個", () => {
    const row = new Row(0);
    const wrapper = mount(VRow, { props: { row, validMoves: [] } });
    expect(wrapper.findAll("button.cell-wrapper").length).toBe(0);
  });
});
