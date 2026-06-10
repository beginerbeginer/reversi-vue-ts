import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { useGameStore } from "@/stores/game";
import VMain from "@/components/VMain.vue";

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const vuetify = createVuetify();

describe("VMain / CPUモード設定", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockPush.mockClear();
  });

  it("ノーマルモードとCPUモードの選択ボタンが表示される", () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    expect(wrapper.find("[data-testid='mode-normal']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='mode-cpu']").exists()).toBe(true);
  });

  it("デフォルト（ノーマルモード）でスタートすると gameMode: normal が store に保存される", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.gameMode).toBe("normal");
  });

  it("CPUモードを選択してスタートすると gameMode: cpu が store に保存される", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.gameMode).toBe("cpu");
  });

  it("ノーマルモードでは先手/後手トグルが表示されない", () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    expect(wrapper.find("[data-testid='player-color-toggle']").exists()).toBe(
      false,
    );
  });

  it("CPU対戦モードを選択すると先手/後手トグルが表示される", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    expect(wrapper.find("[data-testid='player-color-toggle']").exists()).toBe(
      true,
    );
  });

  it("CPU対戦 + 黒（先手）でスタートすると store の cpuColor が White になる", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.cpuColor).toBe("white");
  });

  it("CPU対戦 + 白（後手）でスタートすると store の cpuColor が Black になる", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    await wrapper.find("[data-testid='player-color-white']").trigger("click");
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.cpuColor).toBe("black");
  });

  it("CPU対戦モードを選択するとallowUndoチェックボックスがdisabledになる", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    const checkbox = wrapper.find(
      "[data-testid='allow-undo-checkbox'] input[type='checkbox']",
    );
    expect((checkbox.element as HTMLInputElement).disabled).toBe(true);
  });

  it("CPU対戦モードに切り替えるとallowUndoがfalseにリセットされる", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    const checkbox = wrapper.find(
      "[data-testid='allow-undo-checkbox'] input[type='checkbox']",
    );
    await checkbox.setValue(true);
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.allowUndo).toBe(false);
  });

  it("ノーマルモードに戻すとallowUndoチェックボックスがenabledになる", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    await wrapper.find("[data-testid='mode-normal']").trigger("click");
    const checkbox = wrapper.find(
      "[data-testid='allow-undo-checkbox'] input[type='checkbox']",
    );
    expect((checkbox.element as HTMLInputElement).disabled).toBe(false);
  });

  it("ノーマルモードでは難易度選択トグルが表示されない", () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    expect(wrapper.find("[data-testid='cpu-level-toggle']").exists()).toBe(
      false,
    );
  });

  it("CPU対戦モードを選択すると難易度選択トグルが表示される", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    expect(wrapper.find("[data-testid='cpu-level-toggle']").exists()).toBe(
      true,
    );
  });

  it("難易度はデフォルトで「初級」が選択されている", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.cpuLevel).toBe("beginner");
  });

  it("「中級」を選択してスタートすると store の cpuLevel が intermediate になる", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    await wrapper
      .find("[data-testid='cpu-level-intermediate']")
      .trigger("click");
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.cpuLevel).toBe("intermediate");
  });
});
