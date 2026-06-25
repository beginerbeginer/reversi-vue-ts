<template>
  <div class="board">
    <VRow v-for="row in board.rows" :key="row.num" :row="row" />
  </div>
</template>

<script setup lang="ts">
import VRow from "@/components/reversi/VRow.vue";
import { type Board } from "@/models/reversi";

defineProps<{ board: Board }>();
</script>

<style scoped>
/* 親幅まで縮むが 8 セル分(64px×8)を上限に保つ。狭幅画面でのはみ出しを防ぎ、
   デスクトップでは従来の固定サイズと同じ見た目を維持するため */
.board {
  width: 100%;
  max-width: 512px;
}
</style>
