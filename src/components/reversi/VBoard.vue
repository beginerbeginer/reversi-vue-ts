<template>
  <div class="board">
    <VRow
      v-for="row in board.rows"
      :key="row.num"
      :row="row"
      :valid-moves="validMoves"
    />
  </div>
</template>

<script setup lang="ts">
import VRow from "@/components/reversi/VRow.vue";
import { type Board, type Point } from "@/models/reversi";

// validMoves は VGame（store を知る層）から受け取り VRow へ中継するだけ
defineProps<{ board: Board; validMoves: Point[] }>();
</script>

<style scoped>
/* 親幅まで縮むが 8 セル分(64px×8)を上限に保つ。狭幅画面でのはみ出しを防ぎ、
   デスクトップでは従来の固定サイズと同じ見た目を維持するため */
.board {
  width: 100%;
  max-width: 512px;
}
</style>
