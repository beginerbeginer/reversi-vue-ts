import { reactive, computed, ref, toRaw } from "vue";
import { defineStore } from "pinia";
import { Board, CellState, Point } from "@/models/reversi";

export const useGameStore = defineStore("game", () => {
  const board = reactive(new Board());
  const lastPassed = ref<CellState | null>(null);

  const current = computed(() =>
    board.turn === CellState.Black ? "黒の手番" : "白の手番",
  );

  // 両者ともパスになる = どちらの手番でも置ける場所がない
  // toRaw で next() を呼ぶことで reactive なターン変更を起こさずに相手番を検査する
  const isGameOver = computed(() => {
    const currentTurnCanPass = board.shouldPass();
    if (!currentTurnCanPass) return false;
    const raw = toRaw(board);
    raw.next();
    const otherTurnCanPass = board.shouldPass();
    raw.next();
    return otherTurnCanPass;
  });

  const validMoves = computed(() => board.validMoves());

  const winner = computed((): CellState | null => {
    if (board.blacks > board.whites) return CellState.Black;
    if (board.whites > board.blacks) return CellState.White;
    return null;
  });

  function reset() {
    const fresh = new Board();
    board.turn = fresh.turn;
    board.rows.forEach((row, i) => {
      row.cells.forEach((cell, j) => {
        cell.state = fresh.rows[i].cells[j].state;
      });
    });
    lastPassed.value = null;
  }

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

  return {
    board,
    current,
    put,
    reset,
    lastPassed,
    isGameOver,
    winner,
    validMoves,
  };
});
