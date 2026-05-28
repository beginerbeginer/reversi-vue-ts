import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

const saved = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultTheme = saved ?? (prefersDark ? "dark" : "light");

export default createVuetify({
  icons: { defaultSet: "mdi" },
  theme: { defaultTheme },
});
