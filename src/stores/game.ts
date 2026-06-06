import { reactive, computed, ref, toRaw } from "vue";
import { defineStore } from "pinia";
import { Board, CellState, Point } from "@/models/reversi";

type BoardSnapshot = { rows: { state: CellState }[][]; turn: CellState };
export type GameMode = "normal" | "cpu";

export const useGameStore = defineStore("game", () => {
  const board = reactive(new Board());
  const lastPassed = ref<CellState | null>(null);
  const allowUndo = ref(false);
  const gameMode = ref<GameMode>("normal");
  const history = ref<BoardSnapshot[]>([]);

  const canUndo = computed(() => allowUndo.value && history.value.length > 0);

  const current = computed(() =>
    board.turn === CellState.Black ? "黒の手番" : "白の手番",
  );

  const validMoves = computed(() => board.validMoves());

  // 両者ともパスになる = どちらの手番でも置ける場所がない
  // 現在手番は validMoves（computed 済み）を再利用し、64 マス探索の重複を避ける
  // toRaw で next() を呼ぶことで reactive なターン変更を起こさずに相手番を検査する
  const isGameOver = computed(() => {
    if (validMoves.value.length > 0) return false;
    const raw = toRaw(board);
    raw.next();
    const otherCanMove = raw.validMoves().length > 0;
    raw.next();
    return !otherCanMove;
  });

  const winner = computed((): CellState | null => {
    if (board.blacks > board.whites) return CellState.Black;
    if (board.whites > board.blacks) return CellState.White;
    return null;
  });

  function startGame(options: { allowUndo: boolean; gameMode?: GameMode }) {
    allowUndo.value = options.allowUndo;
    gameMode.value = options.gameMode ?? "normal";
    reset();
  }

  function undo() {
    if (!canUndo.value) return;
    const snapshot = history.value.pop()!;
    board.turn = snapshot.turn;
    board.rows.forEach((row, i) => {
      row.cells.forEach((cell, j) => {
        cell.state = snapshot.rows[i][j].state;
      });
    });
    lastPassed.value = null;
  }

  function reset() {
    const fresh = new Board();
    board.turn = fresh.turn;
    board.rows.forEach((row, i) => {
      row.cells.forEach((cell, j) => {
        cell.state = fresh.rows[i].cells[j].state;
      });
    });
    lastPassed.value = null;
    history.value = [];
  }

  function put(x: number, y: number) {
    const p = new Point(x, y);
    const turnBefore = board.turn;
    const wasEmpty = board.ref(p).isNone;

    // { state: c.state } で新オブジェクトを生成する。cell 参照ごと保存すると
    // reactive な参照を共有してしまい、undo 後に現在の盤面が書き換わるため
    const snapshot = allowUndo.value
      ? {
          rows: board.rows.map((row) =>
            row.cells.map((c) => ({ state: c.state })),
          ),
          turn: board.turn,
        }
      : null;

    board.put(p);

    const stonePlaced = wasEmpty && !board.ref(p).isNone;
    if (snapshot && stonePlaced) {
      history.value.push(snapshot);
    }
    // 石が置かれたのにターンが戻ってきた = 相手がパスされた
    if (stonePlaced && board.turn === turnBefore) {
      lastPassed.value =
        turnBefore === CellState.Black ? CellState.White : CellState.Black;
    } else {
      lastPassed.value = null;
    }
    // ゲームオーバー時はパス通知ではなく勝敗ダイアログのみ表示する
    if (isGameOver.value) {
      lastPassed.value = null;
    }
  }

  return {
    board,
    current,
    put,
    lastPassed,
    isGameOver,
    winner,
    validMoves,
    allowUndo,
    gameMode,
    canUndo,
    startGame,
    undo,
  };
});
