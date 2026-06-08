import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("useGameStore / CPU自動着手", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("cpu モードで put() すると 0.5s 待機してから CPU が自動着手する", async () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "black",
    });
    store.put(3, 2);
    // 人間が置いた直後: 白（CPU）番のまま — まだ着手していない
    expect(store.board.turn).toBe(CellState.White);
    await vi.runAllTimersAsync();
    // 0.5s 後: CPU が着手して黒（人間）番に戻る
    expect(store.board.turn).toBe(CellState.Black);
  });

  it("CPU 着手後、手番が人間側（黒）に戻る", async () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "black",
    });
    store.put(3, 2);
    await vi.runAllTimersAsync();
    expect(store.board.turn).toBe(CellState.Black);
  });

  it("normal モードでは put() 後に手番が白のまま（CPU は自動着手しない）", async () => {
    const store = useGameStore();
    store.startGame({ allowUndo: false, gameMode: "normal" });
    store.put(3, 2);
    await vi.runAllTimersAsync();
    expect(store.board.turn).toBe(CellState.White);
  });

  it("ゲームオーバー後は CPU の自動着手が実行されない", async () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "black",
    });
    store.board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.Black)),
    );
    store.board.rows[0].cells[0].state = CellState.None;
    store.board.rows[0].cells[1].state = CellState.White;
    store.board.turn = CellState.Black;
    const totalBefore = store.board.blacks + store.board.whites;
    store.put(0, 0);
    await vi.runAllTimersAsync();
    expect(store.isGameOver).toBe(true);
    expect(store.board.blacks + store.board.whites).toBe(totalBefore + 1);
  });

  it("triggerCpuMove() は CPU が先手のとき 0.5s 後に石を自動で置く", async () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "white",
    });
    const blacksBefore = store.board.blacks;
    store.triggerCpuMove();
    expect(store.board.blacks).toBe(blacksBefore); // まだ動いていない
    await vi.runAllTimersAsync();
    expect(store.board.blacks).toBeGreaterThan(blacksBefore);
  });

  it("triggerCpuMove() は normal モードでは何もしない", async () => {
    const store = useGameStore();
    store.startGame({ allowUndo: false, gameMode: "normal" });
    const blacksBefore = store.board.blacks;
    store.triggerCpuMove();
    await vi.runAllTimersAsync();
    expect(store.board.blacks).toBe(blacksBefore);
  });

  it("triggerCpuMove() は人間が先手（board.turn が cpuColor と不一致）では何もしない", async () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "black",
    });
    const blacksBefore = store.board.blacks;
    store.triggerCpuMove();
    await vi.runAllTimersAsync();
    expect(store.board.blacks).toBe(blacksBefore);
  });

  it("cpu モードで put() → undo() すると人間の手番（黒）に戻る", async () => {
    const store = useGameStore();
    store.startGame({ allowUndo: true, gameMode: "cpu", playerColor: "black" });
    store.put(3, 2);
    store.undo(); // CPU が動く前に undo
    await vi.runAllTimersAsync(); // CPU タイマーが発火しても盤面は戻っている
    expect(store.board.turn).toBe(CellState.Black);
  });

  it("cpu のターン中に人間が put() しても盤面が変わらない", async () => {
    const store = useGameStore();
    store.startGame({
      allowUndo: false,
      gameMode: "cpu",
      playerColor: "white",
    });
    const blacksBefore = store.board.blacks;
    store.put(3, 2); // 黒番なのに白が押す → ガードで弾かれる
    await vi.runAllTimersAsync();
    expect(store.board.blacks).toBe(blacksBefore);
  });
});
