import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("gameStore 統合テスト", () => {
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

  describe("待った（undo）複数回", () => {
    it("3手打った後に3回 undo すると初期状態に戻る", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });

      const initialBlacks = store.board.blacks;
      const initialWhites = store.board.whites;
      const initialTurn = store.board.turn;

      for (let i = 0; i < 3; i++) {
        const move = store.validMoves[0];
        store.put(move.x, move.y);
      }

      store.undo();
      store.undo();
      store.undo();

      expect(store.board.blacks).toBe(initialBlacks);
      expect(store.board.whites).toBe(initialWhites);
      expect(store.board.turn).toBe(initialTurn);
      expect(store.canUndo).toBe(false);
    });

    it("2手打って2回 undo した後、再度同じ手を打つと同じ盤面になる", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });

      const firstMove = store.validMoves[0];
      store.put(firstMove.x, firstMove.y);
      const secondMove = store.validMoves[0];
      store.put(secondMove.x, secondMove.y);

      const blacksAfter2 = store.board.blacks;
      const whitesAfter2 = store.board.whites;

      store.undo();
      store.undo();

      // 同じ手順を再度打つ
      store.put(firstMove.x, firstMove.y);
      store.put(secondMove.x, secondMove.y);

      expect(store.board.blacks).toBe(blacksAfter2);
      expect(store.board.whites).toBe(whitesAfter2);
    });

    it("5手打って undo を繰り返すと履歴が順に減る", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });

      for (let i = 0; i < 5; i++) {
        if (store.validMoves.length === 0) break;
        store.put(store.validMoves[0].x, store.validMoves[0].y);
      }

      for (let remaining = 4; remaining >= 0; remaining--) {
        expect(store.canUndo).toBe(true);
        store.undo();
      }
      expect(store.canUndo).toBe(false);
    });
  });

  describe("ゲームオーバーへの到達", () => {
    it("最後の1手を store.put() で打ってゲームオーバーになる", () => {
      const store = useGameStore();
      // 全マス黒・(0,0) のみ空き・(1,0)=白 → 黒が (0,0) に置くと全マス黒でゲームオーバー
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.turn = CellState.Black;

      expect(store.isGameOver).toBe(false);
      store.put(0, 0);

      expect(store.isGameOver).toBe(true);
      expect(store.winner).toBe(CellState.Black);
    });

    it("ゲームオーバー直後は lastPassed が null（勝敗ダイアログを優先する）", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.turn = CellState.Black;

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

  describe("パスを跨ぐゲーム進行", () => {
    it("パス後も次の手を打てて lastPassed がリセットされる", () => {
      const store = useGameStore();
      // 白がパスになるがゲームオーバーにはならない盤面
      // (0,0)=空き、(0,1)=白、(0,2)=黒（黒は (0,0) に置ける）
      // (0,3)=空き、(0,4)=白、(0,5)=黒（put 後も黒は (0,3) に置けてゲームオーバーにならない）
      // 残りはすべて黒
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.rows[0].cells[3].state = CellState.None;
      store.board.rows[0].cells[4].state = CellState.White;
      store.board.turn = CellState.Black;

      store.put(0, 0);
      expect(store.lastPassed).toBe(CellState.White);
      expect(store.board.turn).toBe(CellState.Black);

      store.put(0, 3);
      expect(store.lastPassed).toBeNull();
    });

    it("パス後の手番は put() 前と同じプレイヤーのまま", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.rows[0].cells[3].state = CellState.None;
      store.board.rows[0].cells[4].state = CellState.White;
      store.board.turn = CellState.Black;

      store.put(0, 0);

      // 白がパスされたので黒の手番のまま戻る
      expect(store.board.turn).toBe(CellState.Black);
    });
  });
});
