import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VMain from "@/components/VMain.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "VMain",
    component: VMain,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
