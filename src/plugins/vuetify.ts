import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

type Theme = "light" | "dark";
const VALID_THEMES: readonly Theme[] = ["light", "dark"];

export function resolveTheme(
  saved: string | null,
  prefersDark: boolean,
): Theme {
  if (saved !== null && (VALID_THEMES as readonly string[]).includes(saved)) {
    return saved as Theme;
  }
  return prefersDark ? "dark" : "light";
}

const saved = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultTheme = resolveTheme(saved, prefersDark);

export default createVuetify({
  icons: { defaultSet: "mdi" },
  theme: { defaultTheme },
});
