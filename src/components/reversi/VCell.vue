<template>
  <!-- 有効な手はネイティブ button を使う。div + role="button" より意味が明確で linter も通るため -->
  <button
    v-if="isValid"
    class="cell-wrapper"
    :aria-label="ariaLabel"
    @click="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
    <div class="cell"></div>
    <div class="stone" :class="stoneClass"></div>
    <div class="valid-hint"></div>
  </button>
  <!-- 石・空きマスはインタラクションなし -->
  <div
    v-else
    class="cell-wrapper"
    :role="props.cell.isBlack || props.cell.isWhite ? 'img' : undefined"
    :aria-label="
      props.cell.isBlack || props.cell.isWhite ? ariaLabel : undefined
    "
  >
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

const isValid = computed(() =>
  store.validMoves.some((p) => p.x === props.cell.x && p.y === props.cell.y),
);

// 座標は 1 始まりで表記する。スクリーンリーダー向けに石の状態を自然言語で伝えるため
const ariaLabel = computed(() => {
  const pos = `${props.cell.x + 1},${props.cell.y + 1}`;
  if (props.cell.isBlack) return `${pos} 黒の石`;
  if (props.cell.isWhite) return `${pos} 白の石`;
  return `${pos} 置けます`;
});

function onClick() {
  store.put(props.cell.x, props.cell.y);
}
</script>

<style scoped>
.cell-wrapper {
  position: relative;
  /* button のデフォルトスタイルをリセットする。見た目はセルと同一にするため */
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
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
