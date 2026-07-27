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

describe("VMain / 超上級CPU の選択", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockPush.mockClear();
  });

  it("CPU対戦モードで超上級を選んでスタートすると cpuLevel: expert が保存される", async () => {
    const store = useGameStore();
    const wrapper = mount(VMain, { global: { plugins: [vuetify] } });

    await wrapper.find("[data-testid='mode-cpu']").trigger("click");
    await wrapper.find("[data-testid='cpu-level-expert']").trigger("click");
    await wrapper.find("[data-testid='start-button']").trigger("click");

    expect(store.cpuLevel).toBe("expert");
  });
});
