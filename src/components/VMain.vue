<template>
  <v-container fluid>
    <h1 class="text-h4 text-center mb-6">リバーシ</h1>

    <div class="d-flex justify-center mb-4">
      <v-btn-toggle
        v-model="selectedMode"
        mandatory
        color="primary"
        data-testid="mode-toggle"
      >
        <v-btn value="normal" data-testid="mode-normal">ノーマル</v-btn>
        <v-btn value="cpu" data-testid="mode-cpu">CPU対戦</v-btn>
      </v-btn-toggle>
    </div>

    <div v-if="selectedMode === 'cpu'" class="d-flex justify-center mb-4">
      <v-btn-toggle
        v-model="selectedPlayerColor"
        mandatory
        color="primary"
        data-testid="player-color-toggle"
      >
        <v-btn value="black" data-testid="player-color-black">黒（先手）</v-btn>
        <v-btn value="white" data-testid="player-color-white">白（後手）</v-btn>
      </v-btn-toggle>
    </div>

    <div v-if="selectedMode === 'cpu'" class="d-flex justify-center mb-4">
      <v-btn-toggle
        v-model="selectedCpuLevel"
        mandatory
        color="primary"
        data-testid="cpu-level-toggle"
      >
        <v-btn value="beginner" data-testid="cpu-level-beginner">初級</v-btn>
        <v-btn value="intermediate" data-testid="cpu-level-intermediate"
          >中級</v-btn
        >
        <v-btn value="advanced" data-testid="cpu-level-advanced">上級</v-btn>
        <v-btn value="expert" data-testid="cpu-level-expert">超上級</v-btn>
      </v-btn-toggle>
    </div>

    <div class="d-flex justify-center mb-4">
      <v-checkbox
        v-model="allowUndoEnabled"
        label="待った機能を有効にする"
        data-testid="allow-undo-checkbox"
        :disabled="selectedMode === 'cpu'"
        :hint="selectedMode === 'cpu' ? 'CPU対戦では利用できません' : ''"
        hide-details="auto"
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import type { GameMode, CpuLevel } from "@/stores/game";

const router = useRouter();
const store = useGameStore();
const allowUndoEnabled = ref(false);
const selectedMode = ref<GameMode>("normal");
const selectedPlayerColor = ref<"black" | "white">("black");
const selectedCpuLevel = ref<CpuLevel>("beginner");

// cpu モードに切り替えた瞬間に allowUndo を解除する。
// disabled にするだけでは既存の true 値が残り startGame に渡ってしまうため
watch(selectedMode, (mode) => {
  if (mode === "cpu") allowUndoEnabled.value = false;
});

function startGame() {
  store.startGame({
    allowUndo: allowUndoEnabled.value,
    gameMode: selectedMode.value,
    playerColor: selectedPlayerColor.value,
    cpuLevel: selectedCpuLevel.value,
  });
  router.push("/game");
}
</script>
