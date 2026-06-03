import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("gameStore / 連続プレイ・パス", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("複数手連続プレイ", () => {
    it("初手から10手 validMoves を使って交互に打っても石数の合計が一貫している", () => {
      const store = useGameStore();

      for (let i = 0; i < 10; i++) {
        if (store.isGameOver || store.validMoves.length === 0) break;
        const prevTotal = store.board.blacks + store.board.whites;
        const move = store.validMoves[0];
        store.put(move.x, move.y);
        expect(store.board.blacks + store.board.whites).toBeGreaterThan(
          prevTotal,
        );
        expect(store.board.blacks + store.board.whites).toBeLessThanOrEqual(64);
      }
    });

    it("黒が (3,2) に置いた後、白が有効手に置くと白の石が増える", () => {
      const store = useGameStore();
      store.put(3, 2);

      const prevWhites = store.board.whites;
      const whiteMove = store.validMoves[0];
      store.put(whiteMove.x, whiteMove.y);

      expect(store.board.whites).toBeGreaterThan(prevWhites);
    });

    it("連続プレイ中に手番が交互に切り替わる", () => {
      const store = useGameStore();
      const turns: CellState[] = [];

      for (let i = 0; i < 6; i++) {
        if (store.isGameOver || store.validMoves.length === 0) break;
        turns.push(store.board.turn);
        const move = store.validMoves[0];
        store.put(move.x, move.y);
      }

      // 偶数インデックスは黒、奇数インデックスは白（パスなしの場合）
      for (let i = 0; i < turns.length - 1; i++) {
        expect(turns[i]).not.toBe(turns[i + 1]);
      }
    });
  });

  describe("パスを跨ぐゲーム進行", () => {
    // 白がパスになるがゲームオーバーにはならない盤面セットアップ
    // (0,0)=空き、(0,1)=白、(0,2)=黒（黒は (0,0) に置ける）
    // (0,3)=空き、(0,4)=白、(0,5)=黒（put 後も黒は (0,3) に置けてゲームオーバーにならない）
    // 残りはすべて黒
    const setupPassBoard = (store: ReturnType<typeof useGameStore>) => {
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.rows[0].cells[3].state = CellState.None;
      store.board.rows[0].cells[4].state = CellState.White;
      store.board.turn = CellState.Black;
    };

    it("パス後も次の手を打てて lastPassed がリセットされる", () => {
      const store = useGameStore();
      setupPassBoard(store);

      store.put(0, 0);
      expect(store.lastPassed).toBe(CellState.White);
      expect(store.board.turn).toBe(CellState.Black);

      store.put(0, 3);
      expect(store.lastPassed).toBeNull();
    });

    it("パス後の手番は put() 前と同じプレイヤーのまま", () => {
      const store = useGameStore();
      setupPassBoard(store);

      store.put(0, 0);

      // 白がパスされたので黒の手番のまま戻る
      expect(store.board.turn).toBe(CellState.Black);
    });
  });
});
