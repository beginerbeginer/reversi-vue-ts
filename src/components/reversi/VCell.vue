<template>
  <div class="cell-wrapper" @click="onClick">
    <div class="cell"></div>
    <div class="stone" :class="stoneClass"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type Cell } from "@/models/reversi";
import { useGameStore } from "@/stores/game";

const props = defineProps<{ cell: Cell }>();
const store = useGameStore();

const stoneClass = computed(() => ({
  "white-stone": props.cell.isWhite,
  "black-stone": props.cell.isBlack,
}));

function onClick() {
  store.put(props.cell.x, props.cell.y);
}
</script>

<style scoped>
.cell-wrapper {
  position: relative;
}

.cell {
  height: 64px;
  width: 64px;
  background-color: darkgreen;
  border: 2px solid black;
}

.stone {
  position: absolute;
  top: 2px;
  left: 2px;
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

.white-stone {
  background-color: white;
}

.black-stone {
  background-color: black;
}
</style>
