import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import VMain from "@/components/VMain.vue";
import VGame from "@/components/reversi/VGame.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "VMain", component: VMain },
  { path: "/game", name: "VGame", component: VGame },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
