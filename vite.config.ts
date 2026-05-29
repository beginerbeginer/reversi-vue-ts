import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "path";

export default defineConfig(({ command }) => ({
  base:
    command === "build" && process.env.GITHUB_ACTIONS
      ? "/reversi-vue-ts/"
      : "/",
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    server: {
      deps: {
        inline: ["vuetify"],
      },
    },
    include: ["tests/unit/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "json-summary"],
      include: ["src/**/*.ts", "src/**/*.vue"],
    },
  },
}));
