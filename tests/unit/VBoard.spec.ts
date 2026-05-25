import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import VBoard from "@/components/reversi/VBoard.vue";
import { Board } from "@/models/reversi";

describe("VBoard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("board の rows の数（8行）だけ行が描画される", () => {
    const board = new Board();
    const wrapper = mount(VBoard, { props: { board } });
    expect(wrapper.findAll(".d-flex").length).toBe(8);
  });
});
