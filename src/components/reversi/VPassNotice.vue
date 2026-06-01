<template>
  <v-snackbar
    v-model="showPassNotice"
    :timeout="3000"
    color="info"
    location="top"
  >
    {{ passMessage }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

const store = useGameStore();
const showPassNotice = ref(false);

const passMessage = computed(() => {
  if (store.lastPassed === CellState.Black) return "黒はパスです";
  if (store.lastPassed === CellState.White) return "白はパスです";
  return "";
});

watch(
  () => store.lastPassed,
  (val) => {
    showPassNotice.value = val !== null;
  },
);
</script>
