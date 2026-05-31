<template>
  <v-container>
    <div class="d-flex justify-center">
      <VBoard :board="store.board" />
    </div>
    <div class="d-flex justify-center">
      <h1>{{ store.current }}</h1>
    </div>
    <div class="d-flex justify-center">
      <h1>白の石：{{ store.board.whites }}</h1>
    </div>
    <div class="d-flex justify-center">
      <h1>黒の石：{{ store.board.blacks }}</h1>
    </div>
    <div v-if="store.allowUndo" class="d-flex justify-center mt-2">
      <v-btn
        data-testid="undo-button"
        :disabled="!store.canUndo"
        variant="outlined"
        @click="store.undo()"
      >
        待った
      </v-btn>
    </div>
    <v-dialog v-model="store.isGameOver" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center pt-6">ゲーム終了</v-card-title>
        <v-card-text class="text-center text-h6">
          <span v-if="store.winner === CellState.Black">黒の勝ち 🎉</span>
          <span v-else-if="store.winner === CellState.White">白の勝ち 🎉</span>
          <span v-else>引き分け</span>
          <div class="mt-2 text-body-1">
            黒 {{ store.board.blacks }} 対 白 {{ store.board.whites }}
          </div>
        </v-card-text>
        <v-card-actions class="justify-center pb-4">
          <!-- 盤面リセットはスタート画面の startGame() が担う。ここでは遷移のみ行う。 -->
          <v-btn
            data-testid="retry-button"
            color="primary"
            variant="elevated"
            @click="router.push('/')"
          >
            もう一度
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="showPassNotice"
      :timeout="3000"
      color="info"
      location="top"
    >
      {{ passMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import confetti from "canvas-confetti";
import VBoard from "@/components/reversi/VBoard.vue";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

const store = useGameStore();
const router = useRouter();
const showPassNotice = ref(false);

const passMessage = computed(() => {
  if (store.lastPassed === CellState.Black) return "黒はパスです";
  if (store.lastPassed === CellState.White) return "白はパスです";
  return "";
});

watch(
  () => store.lastPassed,
  (val) => {
    if (val !== null) {
      showPassNotice.value = true;
    } else {
      showPassNotice.value = false;
    }
  },
);

watch(
  () => store.isGameOver,
  (val) => {
    if (val && store.winner !== null) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  },
);
</script>
