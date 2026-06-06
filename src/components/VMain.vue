<template>
  <v-container fluid>
    <h1 class="text-h4 text-center mb-6">リバーシ</h1>

    <div class="d-flex justify-center mb-4">
      <v-btn-toggle v-model="selectedMode" mandatory data-testid="mode-toggle">
        <v-btn value="normal" data-testid="mode-normal">ノーマル</v-btn>
        <v-btn value="cpu" data-testid="mode-cpu">CPU対戦</v-btn>
      </v-btn-toggle>
    </div>

    <div class="d-flex justify-center mb-4">
      <v-checkbox
        v-model="allowUndoEnabled"
        label="待った機能を有効にする"
        data-testid="allow-undo-checkbox"
        hide-details
      />
    </div>

    <div class="d-flex justify-center">
      <v-btn
        color="primary"
        variant="outlined"
        data-testid="start-button"
        @click="startGame"
      >
        ゲームスタート！！
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import type { GameMode } from "@/stores/game";

const router = useRouter();
const store = useGameStore();
const allowUndoEnabled = ref(false);
const selectedMode = ref<GameMode>("normal");

function startGame() {
  store.startGame({
    allowUndo: allowUndoEnabled.value,
    gameMode: selectedMode.value,
  });
  router.push("/game");
}
</script>
