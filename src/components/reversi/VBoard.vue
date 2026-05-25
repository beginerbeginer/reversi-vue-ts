<template>
  <div>
    <VRow v-for="row in board.rows" :key="row.num" :row="row" />
  </div>
</template>

<script setup lang="ts">
import VRow from "@/components/reversi/VRow.vue";
import { type Board } from "@/models/reversi";

defineProps<{ board: Board }>();
</script>
