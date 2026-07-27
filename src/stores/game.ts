import { reactive, computed, ref, toRaw } from "vue";
import { defineStore } from "pinia";
import { Board, CellState, Point } from "@/models/reversi";
import {
  selectMoveBeginner,
  selectMoveIntermediate,
  selectMoveAdvanced,
  selectMoveExpert,
} from "@/models/cpu";

type BoardSnapshot = { rows: { state: CellState }[][]; turn: CellState };
export type GameMode = "normal" | "cpu";
export type CpuLevel = "beginner" | "intermediate" | "advanced" | "expert";

export const useGameStore = defineStore("game", () => {
  const board = reactive(new Board());
  const lastPassed = ref<CellState | null>(null);
  const allowUndo = ref(false);
  const gameMode = ref<GameMode>("normal");
  const cpuColor = ref<CellState>(CellState.White);
  const cpuLevel = ref<CpuLevel>("beginner");
  const history = ref<BoardSnapshot[]>([]);

  const canUndo = computed(() => allowUndo.value && history.value.length > 0);

  const current = computed(() =>
    board.turn === CellState.Black ? "黒の手番" : "白の手番",
  );

  const validMoves = computed(() => board.validMoves());

  // 両者ともパスになる = どちらの手番でも置ける場所がない。
  // 現在手番は validMoves（computed 済み）を再利用し、64 マス探索の重複を避ける。
  // 相手番は turn を変えずに validMovesFor で問い合わせる（破壊的な next() の往復が不要）
  const isGameOver = computed(() => {
    if (validMoves.value.length > 0) return false;
    const opponent =
      board.turn === CellState.Black ? CellState.White : CellState.Black;
    return board.validMovesFor(opponent).length === 0;
  });

  const winner = computed((): CellState | null => {
    if (board.blacks > board.whites) return CellState.Black;
    if (board.whites > board.blacks) return CellState.White;
    return null;
  });

  // レベルごとの selectMove を返す。レベルを追加するときはここにケースを追加する
  function getCpuMoveSelector() {
    if (cpuLevel.value === "expert") return selectMoveExpert;
    if (cpuLevel.value === "advanced") return selectMoveAdvanced;
    if (cpuLevel.value === "intermediate") return selectMoveIntermediate;
    return selectMoveBeginner;
  }

  // 全レベル共通: 500ms 待機してから CPU が着手する
  // put() から再帰呼び出しせず fire-and-forget で呼ぶことで
  // lastPassed の退避/復元ハックが不要になる
  async function cpuTurn(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
    if (
      gameMode.value !== "cpu" ||
      isGameOver.value ||
      board.turn !== cpuColor.value
    )
      return;
    const selectMove = getCpuMoveSelector();
    const move = selectMove(toRaw(board), cpuColor.value);
    if (move) {
      put(move.x, move.y, true);
      // 人間がパスになった場合、CPU がもう一度打つ（再度 0.5s 待つ）
      if (!isGameOver.value && board.turn === cpuColor.value) {
        void cpuTurn();
      }
    }
  }

  function startGame(options: {
    allowUndo: boolean;
    gameMode?: GameMode;
    playerColor?: "black" | "white";
    cpuLevel?: CpuLevel;
  }) {
    gameMode.value = options.gameMode ?? "normal";
    // cpu モードでは undo による巻き戻しが機能しないため強制的に無効化する
    allowUndo.value = gameMode.value === "cpu" ? false : options.allowUndo;
    cpuColor.value =
      options.playerColor === "white" ? CellState.Black : CellState.White;
    cpuLevel.value = options.cpuLevel ?? "beginner";
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

  function put(x: number, y: number, isCpuMove = false) {
    // cpu のターン中は人間の操作を受け付けない
    if (!isCpuMove && gameMode.value === "cpu" && board.turn === cpuColor.value)
      return;
    const p = new Point(x, y);
    const turnBefore = board.turn;
    const wasEmpty = board.ref(p).isNone;

    // { state: c.state } で新オブジェクトを生成する。cell 参照ごと保存すると
    // reactive な参照を共有してしまい、undo 後に現在の盤面が書き換わるため
    // CPU の着手は人間が undo したときに一緒に巻き戻すため history に積まない
    const snapshot =
      allowUndo.value && !isCpuMove
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

    // cpu モードで人間が石を置けた後、CPU の手番なら非同期で着手する
    if (
      gameMode.value === "cpu" &&
      stonePlaced &&
      !isGameOver.value &&
      board.turn === cpuColor.value
    ) {
      void cpuTurn();
    }
  }

  function triggerCpuMove() {
    if (
      gameMode.value !== "cpu" ||
      board.turn !== cpuColor.value ||
      isGameOver.value
    )
      return;
    void cpuTurn();
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
    cpuColor,
    cpuLevel,
    canUndo,
    startGame,
    undo,
    triggerCpuMove,
  };
});
