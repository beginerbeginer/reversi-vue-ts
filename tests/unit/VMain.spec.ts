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

describe("VMain", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockPush.mockClear();
  });

  it("「待った機能を有効にする」チェックボックスが存在する", () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    expect(wrapper.find("[data-testid='allow-undo-checkbox']").exists()).toBe(
      true,
    );
  });

  it("チェックをONにしてスタートすると allowUndo: true で startGame が呼ばれ /game に遷移する", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    const checkbox = wrapper.find(
      "[data-testid='allow-undo-checkbox'] input[type='checkbox']",
    );
    await checkbox.setValue(true);
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.allowUndo).toBe(true);
    expect(mockPush).toHaveBeenCalledWith("/game");
  });

  it("チェックをOFFのままスタートすると allowUndo: false で startGame が呼ばれ /game に遷移する", async () => {
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });
    const store = useGameStore();
    await wrapper.find("[data-testid='start-button']").trigger("click");
    expect(store.allowUndo).toBe(false);
    expect(mockPush).toHaveBeenCalledWith("/game");
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
});
