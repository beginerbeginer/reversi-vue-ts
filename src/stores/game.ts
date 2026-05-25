import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import { Board, CellState, Point } from "@/models/reversi";

export const useGameStore = defineStore("game", () => {
  const board = reactive(new Board());

  const current = computed(() =>
    board.turn === CellState.Black ? "黒の手番" : "白の手番",
  );

  function put(x: number, y: number) {
    board.put(new Point(x, y));
  }

  return { board, current, put };
});
