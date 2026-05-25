<template>
  <div class="d-flex">
    <VCell
      v-for="cell in row.cells"
      :key="`${cell.x}-${cell.y}`"
      :cell="cell"
    />
  </div>
</template>

<script setup lang="ts">
import VCell from "@/components/reversi/VCell.vue";
import { type Row } from "@/models/reversi";

defineProps<{ row: Row }>();
</script>
