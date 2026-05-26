import { reactive, computed, ref } from "vue";
import { defineStore } from "pinia";
import { Board, CellState, Point } from "@/models/reversi";

export const useGameStore = defineStore("game", () => {
  const board = reactive(new Board());
  const lastPassed = ref<CellState | null>(null);

  const current = computed(() =>
    board.turn === CellState.Black ? "黒の手番" : "白の手番",
  );

  function put(x: number, y: number) {
    const p = new Point(x, y);
    const turnBefore = board.turn;
    const wasEmpty = board.ref(p).isNone;

    board.put(p);

    const stonePlaced = wasEmpty && !board.ref(p).isNone;
    // 石が置かれたのにターンが戻ってきた = 相手がパスされた
    if (stonePlaced && board.turn === turnBefore) {
      lastPassed.value =
        turnBefore === CellState.Black ? CellState.White : CellState.Black;
    } else {
      lastPassed.value = null;
    }
  }

  return { board, current, put, lastPassed };
});
