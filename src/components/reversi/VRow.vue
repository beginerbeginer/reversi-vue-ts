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
import { computed } from "vue";
import VCell from "@/components/reversi/VCell.vue";
import { type Row, type Cell, type Point } from "@/models/reversi";

const props = defineProps<{ row: Row; validMoves: Point[] }>();

// validMoves が変わったときだけ "x,y" の Set を作り直す。
// 各セルの判定を some() の線形探索から集合参照に変え、
// 再描画コストをセル数 × validMoves 長に依存させないため
const validKeys = computed(
  () => new Set(props.validMoves.map((p) => `${p.x},${p.y}`)),
);

// 各セルが有効手かを判定し VCell に props で渡す。
// VCell 自身に store を参照させないための橋渡し
function isValid(cell: Cell): boolean {
  return validKeys.value.has(`${cell.x},${cell.y}`);
}
</script>
