<template>
  <div class="d-flex">
    <VCell
      v-for="cell in row.cells"
      :key="`${cell.x}-${cell.y}`"
      :cell="cell"
      :is-valid="isValid(cell)"
    />
  </div>
</template>

<script setup lang="ts">
import VCell from "@/components/reversi/VCell.vue";
import { type Row, type Cell, type Point } from "@/models/reversi";

const props = defineProps<{ row: Row; validMoves: Point[] }>();

// 各セルが有効手かを validMoves との一致で判定し、VCell に props で渡す。
// VCell 自身に store を参照させないための橋渡し
function isValid(cell: Cell): boolean {
  return props.validMoves.some((p) => p.x === cell.x && p.y === cell.y);
}
</script>
