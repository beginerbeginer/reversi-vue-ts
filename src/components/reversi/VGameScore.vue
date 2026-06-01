<template>
  <div>
    <div class="d-flex justify-center">
      <h1>{{ store.current }}</h1>
    </div>
    <div class="d-flex justify-center">
      <h1>白の石：{{ store.board.whites }}</h1>
    </div>
    <div class="d-flex justify-center">
      <h1>黒の石：{{ store.board.blacks }}</h1>
    </div>
    <div v-if="store.allowUndo" class="d-flex justify-center mt-2">
      <v-btn
        data-testid="undo-button"
        :disabled="!store.canUndo"
        variant="outlined"
        @click="store.undo()"
      >
        待った
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/game";

const store = useGameStore();
</script>
