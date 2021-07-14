import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VMain from "@/components/VMain.vue";
import VGame from "@/components/reversi/VGame.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "VMain",
    component: VMain,
  },
  {
    path: "/game",
    name: "VGame",
    component: VGame,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
