import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import VBoard from "@/components/reversi/VBoard.vue";
import { Board, Point } from "@/models/reversi";

describe("VBoard", () => {
  // validMoves を props で受け取り VRow へ渡すだけなので store 不要
  it("board の rows の数（8行）だけ行が描画される", () => {
    const board = new Board();
    const wrapper = mount(VBoard, { props: { board, validMoves: [] } });
    expect(wrapper.findAll(".d-flex").length).toBe(8);
  });

  it("validMoves を VRow に渡し、有効手セルが button になる", () => {
    const board = new Board();
    // 初期盤面の黒の有効手のひとつ (3,2)
    const validMoves = [new Point(3, 2)];
    const wrapper = mount(VBoard, { props: { board, validMoves } });
    expect(wrapper.findAll("button.cell-wrapper").length).toBe(1);
  });
});
