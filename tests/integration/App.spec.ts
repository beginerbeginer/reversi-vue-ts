import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { nextTick } from "vue";
import App from "@/App.vue";

const vuetify = createVuetify();

describe("App", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    localStorage.clear();
    wrapper = mount(App, {
      global: {
        plugins: [vuetify],
        stubs: { RouterView: true },
      },
      attachTo: document.body,
    });
  });

  afterEach(() => {
    wrapper.unmount();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("テーマトグルボタンが表示される", () => {
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("ライトモード時にボタンをクリックするとダークモードに切り替わる", async () => {
    vuetify.theme.change("light");
    const changeSpy = vi.spyOn(vuetify.theme, "change");
    await wrapper.find("button").trigger("click");
    expect(changeSpy).toHaveBeenCalledWith("dark");
  });

  it("ダークモード時にボタンをクリックするとライトモードに切り替わる", async () => {
    vuetify.theme.change("dark");
    const changeSpy = vi.spyOn(vuetify.theme, "change");
    await wrapper.find("button").trigger("click");
    expect(changeSpy).toHaveBeenCalledWith("light");
  });

  it("テーマ切り替え時に localStorage に保存される", async () => {
    vuetify.theme.change("light");
    await wrapper.find("button").trigger("click");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("ライトモード時は「夜」アイコンが表示される", async () => {
    vuetify.theme.change("light");
    await nextTick();
    expect(document.body.querySelector(".mdi-weather-night")).toBeTruthy();
  });

  it("ダークモード時は「太陽」アイコンが表示される", async () => {
    vuetify.theme.change("dark");
    await nextTick();
    expect(document.body.querySelector(".mdi-weather-sunny")).toBeTruthy();
  });
});
