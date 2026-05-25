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
  </v-container>
</template>

<script setup lang="ts">
import VBoard from "@/components/reversi/VBoard.vue";
import { useGameStore } from "@/stores/game";

const store = useGameStore();
</script>
