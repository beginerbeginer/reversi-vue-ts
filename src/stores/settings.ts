import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  // デフォルト OFF。アシスト機能はユーザーが明示的に有効化する
  const hoverPreview = ref(
    localStorage.getItem("settings.hoverPreview") === "true",
  );

  watch(hoverPreview, (val) =>
    localStorage.setItem("settings.hoverPreview", String(val)),
  );

  return { hoverPreview };
});
