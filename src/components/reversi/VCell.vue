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

// isValid は親から props で受け取る。末端の VCell が store 全体に依存すると
// 単体テストで Pinia の丸ごとセットアップが必要になり結合が強くなるため
const props = defineProps<{ cell: Cell; isValid: boolean }>();

const stoneClass = computed(() => ({
  "white-stone": props.cell.isWhite,
  "black-stone": props.cell.isBlack,
}));

// 座標は 1 始まりで表記する。スクリーンリーダー向けに石の状態を自然言語で伝えるため
const ariaLabel = computed(() => {
  const pos = `${props.cell.x + 1},${props.cell.y + 1}`;
  if (props.cell.isBlack) return `${pos} 黒の石`;
  if (props.cell.isWhite) return `${pos} 白の石`;
  return `${pos} 置けます`;
});

// store の取得を着手時まで遅らせる。setup で呼ぶと表示だけの VCell も
// Pinia セットアップを要求してしまい、単体テストの負荷が下がらないため
function onClick() {
  useGameStore().put(props.cell.x, props.cell.y);
}
</script>

<style scoped>
.cell-wrapper {
  position: relative;
  /* 行内で 8 等分し正方形を保つ。固定 px だと狭幅画面で盤がはみ出すため */
  flex: 1 1 0;
  aspect-ratio: 1;
  /* button のデフォルトスタイルをリセットする。見た目はセルと同一にするため */
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.cell {
  height: 100%;
  width: 100%;
  /* border をセル幅の内側に収める。relative なセル幅計算とずれないため */
  box-sizing: border-box;
  background-color: darkgreen;
  border: 2px solid black;
}

.stone {
  position: absolute;
  /* 旧 2px/64px ≒ 3% を比率で表現しつつ、下限を border 幅(2px)に揃える。
     狭幅でセルが縮んでも石が枠線に被らないようにするため */
  inset: max(2px, 3%);
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
  /* 旧 11px/64px ≒ 17% を比率で表現する */
  width: 17%;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  transition: opacity 0.15s ease;
}
</style>
