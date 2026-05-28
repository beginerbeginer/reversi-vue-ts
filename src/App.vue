<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>Reversi</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="toggleTheme">
        <v-icon>{{
          isDark ? "mdi-weather-sunny" : "mdi-weather-night"
        }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = computed(() => theme.global.name.value === "dark");

function toggleTheme() {
  const next = isDark.value ? "light" : "dark";
  theme.change(next);
  localStorage.setItem("theme", next);
}
</script>
