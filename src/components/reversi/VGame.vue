<template>
  <v-container>
    <div class="d-flex justify-center">
      <VBoard :board="store.board" />
    </div>
    <VGameScore />
    <VGameOver />
    <VPassNotice />
  </v-container>
</template>

<script setup lang="ts">
import VBoard from "@/components/reversi/VBoard.vue";
import VGameScore from "@/components/reversi/VGameScore.vue";
import VGameOver from "@/components/reversi/VGameOver.vue";
import VPassNotice from "@/components/reversi/VPassNotice.vue";
import { useGameStore } from "@/stores/game";

const store = useGameStore();
</script>
