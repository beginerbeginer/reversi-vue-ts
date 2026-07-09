import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import VMain from "@/components/VMain.vue";
import VGame from "@/components/reversi/VGame.vue";
export const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "Home", component: VMain },
  { path: "/game", name: "Game", component: VGame },
];

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
