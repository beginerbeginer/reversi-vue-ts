<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>Reversi</v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        :aria-label="
          isDark ? 'ライトモードに切り替える' : 'ダークモードに切り替える'
        "
        @click="toggleTheme"
      >
        <v-icon>{{
          isDark ? "mdi-weather-sunny" : "mdi-weather-night"
        }}</v-icon>
      </v-btn>
      <v-btn icon aria-label="設定" @click="router.push('/settings')">
        <v-icon>mdi-cog</v-icon>
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
import { useRouter } from "vue-router";

const router = useRouter();

const theme = useTheme();
const isDark = computed(() => theme.global.name.value === "dark");

function toggleTheme() {
  const next = isDark.value ? "light" : "dark";
  theme.change(next);
  localStorage.setItem("theme", next);
}
</script>
