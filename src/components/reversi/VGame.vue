<template>
  <v-container>
    <div class="d-flex justify-center">
      <VBoard :board="store.board" />
    </div>
    <div class="d-flex justify-center">
      <h1>{{ store.current }}</h1>
    </div>
    <div class="d-flex justify-center">
      <h1>白の石：{{ store.board.whites }}</h1>
    </div>
    <div class="d-flex justify-center">
      <h1>黒の石：{{ store.board.blacks }}</h1>
    </div>
    <v-snackbar
      v-model="showPassNotice"
      :timeout="3000"
      color="info"
      location="top"
    >
      {{ passMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import VBoard from "@/components/reversi/VBoard.vue";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

const store = useGameStore();
const showPassNotice = ref(false);

const passMessage = computed(() =>
  store.lastPassed === CellState.Black ? "黒はパスです" : "白はパスです",
);

watch(
  () => store.lastPassed,
  (val) => {
    if (val !== null) showPassNotice.value = true;
  },
);
</script>
