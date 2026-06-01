<template>
  <v-dialog
    v-model="store.isGameOver"
    persistent
    max-width="400"
    aria-label="ゲーム終了"
  >
    <v-card>
      <v-card-title class="text-h5 text-center pt-6">ゲーム終了</v-card-title>
      <v-card-text class="text-center text-h6">
        <!-- assertive でゲーム終了を即時アナウンス。polite では他の読み上げが優先されゲーム終了が伝わらないため -->
        <span aria-live="assertive" aria-atomic="true">
          <span v-if="store.winner === CellState.Black">黒の勝ち 🎉</span>
          <span v-else-if="store.winner === CellState.White">白の勝ち 🎉</span>
          <span v-else>引き分け</span>
        </span>
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
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import confetti from "canvas-confetti";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

const store = useGameStore();
const router = useRouter();

watch(
  () => store.isGameOver,
  (val) => {
    if (val && store.winner !== null) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  },
);
</script>
