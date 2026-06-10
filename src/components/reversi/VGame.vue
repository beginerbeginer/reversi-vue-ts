<template>
  <v-container>
    <div class="d-flex justify-center">
      <VBoard :board="store.board" />
    </div>
    <VGameScore />
    <VGameOver />
    <VPassNotice />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import VBoard from "@/components/reversi/VBoard.vue";
import VGameScore from "@/components/reversi/VGameScore.vue";
import VGameOver from "@/components/reversi/VGameOver.vue";
import VPassNotice from "@/components/reversi/VPassNotice.vue";
import { useGameStore } from "@/stores/game";

const store = useGameStore();

// cpu先手（白後手選択）のとき、マウント直後はまだ人間が操作していないため
// put() での自動着手が動かない。2秒後に初手をトリガーする
let cpuFirstMoveTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  if (store.gameMode === "cpu" && store.board.turn === store.cpuColor) {
    cpuFirstMoveTimer = setTimeout(() => store.triggerCpuMove(), 2000);
  }
});

// アンマウント時にタイマーをクリアする。クリアしないと unmount 後に
// store を変更してコンソールエラーが出るため
onUnmounted(() => {
  if (cpuFirstMoveTimer !== null) clearTimeout(cpuFirstMoveTimer);
});
</script>
