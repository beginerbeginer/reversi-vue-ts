import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { createRouter, createMemoryHistory } from "vue-router";
import VMain from "@/components/VMain.vue";

const vuetify = createVuetify();

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: VMain }],
  });
}

describe("VMain スナップショット", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("スタート画面の HTML が変わらない", async () => {
    const router = makeRouter();
    await router.push("/");
    await router.isReady();
    const wrapper = mount(VMain, {
      global: { plugins: [vuetify, router] },
      attachTo: document.body,
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });
});
