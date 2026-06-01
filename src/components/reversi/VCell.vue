<template>
  <div
    class="cell-wrapper"
    :role="cellRole"
    :tabindex="cellTabIndex"
    :aria-label="ariaLabel"
    @click="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
    <div class="cell"></div>
    <div class="stone" :class="stoneClass"></div>
    <div v-if="isValid" class="valid-hint"></div>
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

const isValid = computed(() =>
  store.validMoves.some((p) => p.x === props.cell.x && p.y === props.cell.y),
);

// 有効な手だけ button にする。石や置けないマスを button にするとキーボードユーザーが
// Tab で 64 マス全部を通過しなければならず、目的の操作に到達できないため
const cellRole = computed(() => {
  if (isValid.value) return "button";
  if (props.cell.isBlack || props.cell.isWhite) return "img";
  return "presentation";
});

// 有効な手だけ Tab 停止にする。それ以外は tabindex="-1" でフォーカス対象から除外する
const cellTabIndex = computed(() => (isValid.value ? 0 : -1));

// 座標は 1 始まりで表記する。スクリーンリーダー向けに石の状態を自然言語で伝えるため
const ariaLabel = computed(() => {
  const pos = `${props.cell.x + 1},${props.cell.y + 1}`;
  if (props.cell.isBlack) return `${pos} 黒の石`;
  if (props.cell.isWhite) return `${pos} 白の石`;
  if (isValid.value) return `${pos} 置けます`;
  return `${pos} 空き`;
});

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

.valid-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 11px;
  width: 11px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}
</style>
