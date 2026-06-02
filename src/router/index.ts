import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import VMain from "@/components/VMain.vue";
import VGame from "@/components/reversi/VGame.vue";
import VSettings from "@/components/VSettings.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "VMain", component: VMain },
  { path: "/game", name: "VGame", component: VGame },
  { path: "/settings", name: "VSettings", component: VSettings },
];

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
