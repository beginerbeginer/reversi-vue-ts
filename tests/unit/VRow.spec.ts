import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import VRow from "@/components/reversi/VRow.vue";
import { Row } from "@/models/reversi";

describe("VRow", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("row の cells の数だけ VCell が描画される", () => {
    const row = new Row(0);
    const wrapper = mount(VRow, { props: { row } });
    expect(wrapper.findAll(".cell-wrapper").length).toBe(8);
  });
});
