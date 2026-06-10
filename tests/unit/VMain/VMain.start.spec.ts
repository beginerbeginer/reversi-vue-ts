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

describe("VMain / スタート設定", () => {
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
});
