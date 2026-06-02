import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import VSettings from "@/components/VSettings.vue";
import { useSettingsStore } from "@/stores/settings";
import vuetify from "@/plugins/vuetify";

describe("VSettings", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("ホバープレビュースイッチが存在する", () => {
    const wrapper = mount(VSettings, { global: { plugins: [vuetify] } });
    expect(wrapper.find("[data-testid='hover-preview-switch']").exists()).toBe(
      true,
    );
  });

  it("初期状態でホバープレビューは OFF", () => {
    const settings = useSettingsStore();
    expect(settings.hoverPreview).toBe(false);
  });

  it("store の hoverPreview を ON にするとスイッチに反映される", async () => {
    const settings = useSettingsStore();
    settings.hoverPreview = true;
    const wrapper = mount(VSettings, { global: { plugins: [vuetify] } });
    const input = wrapper.find(
      "[data-testid='hover-preview-switch'] input[type='checkbox']",
    );
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });
});
