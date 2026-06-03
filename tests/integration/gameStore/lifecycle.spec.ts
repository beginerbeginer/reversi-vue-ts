import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("gameStore / ゲームオーバー・ライフサイクル", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("ゲームオーバーへの到達", () => {
    // 全マス黒・(0,0) のみ空き・(1,0)=白 → 黒が (0,0) に置くと全マス黒でゲームオーバー
    const setupNearGameOver = (store: ReturnType<typeof useGameStore>) => {
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.turn = CellState.Black;
    };

    it("最後の1手を store.put() で打ってゲームオーバーになる", () => {
      const store = useGameStore();
      setupNearGameOver(store);

      expect(store.isGameOver).toBe(false);
      store.put(0, 0);

      expect(store.isGameOver).toBe(true);
      expect(store.winner).toBe(CellState.Black);
    });

    it("ゲームオーバー直後は lastPassed が null（勝敗ダイアログを優先する）", () => {
      const store = useGameStore();
      setupNearGameOver(store);

      store.put(0, 0);

      expect(store.lastPassed).toBeNull();
    });
  });

  describe("複数ゲームのライフサイクル", () => {
    it("1ゲーム終了後に startGame() → 再プレイできる", () => {
      const store = useGameStore();

      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      expect(store.isGameOver).toBe(true);

      store.startGame({ allowUndo: false });

      expect(store.isGameOver).toBe(false);
      expect(store.board.blacks).toBe(2);
      expect(store.board.whites).toBe(2);
      expect(store.board.turn).toBe(CellState.Black);

      store.put(3, 2);
      expect(store.board.turn).toBe(CellState.White);
    });

    it("allowUndo: true のゲームの後 allowUndo: false で再開すると undo 履歴がリセットされる", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(3, 2);
      expect(store.canUndo).toBe(true);

      store.startGame({ allowUndo: false });
      store.put(3, 2);
      expect(store.canUndo).toBe(false);
    });
  });
});
