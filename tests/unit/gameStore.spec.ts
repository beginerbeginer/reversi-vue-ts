import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "@/stores/game";
import { CellState } from "@/models/reversi";

describe("useGameStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("初期状態で黒が2個ある", () => {
    const store = useGameStore();
    expect(store.board.blacks).toBe(2);
  });

  it("黒が最初の手番である", () => {
    const store = useGameStore();
    expect(store.current).toBe("黒の手番");
  });

  it("put を呼ぶと石が置かれて手番が切り替わる", () => {
    const store = useGameStore();
    store.put(3, 2);
    expect(store.current).toBe("白の手番");
  });

  describe("isGameOver / winner", () => {
    it("初期状態ではゲームオーバーでない", () => {
      const store = useGameStore();
      expect(store.isGameOver).toBe(false);
    });

    it("両者ともパスになるとゲームオーバーになる", () => {
      const store = useGameStore();
      // 全マスを黒で埋める（どちらも置けない）
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      expect(store.isGameOver).toBe(true);
    });

    it("黒が多いとき黒の勝ち", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      expect(store.winner).toBe(CellState.Black);
    });

    it("白が多いとき白の勝ち", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.White)),
      );
      expect(store.winner).toBe(CellState.White);
    });

    it("同数のとき引き分け（null）", () => {
      const store = useGameStore();
      // 32マスを黒、32マスを白で埋める
      let count = 0;
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => {
          cell.state = count++ < 32 ? CellState.Black : CellState.White;
        }),
      );
      expect(store.winner).toBeNull();
    });
  });

  describe("reset (startGame 経由)", () => {
    it("allowUndo: true のとき、startGame を呼ぶと canUndo が false になる", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(3, 2);
      store.startGame({ allowUndo: false });
      expect(store.canUndo).toBe(false);
    });

    it("startGame を呼ぶと石が初期配置に戻る", () => {
      const store = useGameStore();
      store.put(3, 2);
      store.startGame({ allowUndo: false });
      expect(store.board.blacks).toBe(2);
      expect(store.board.whites).toBe(2);
    });

    it("startGame を呼ぶと黒の手番に戻る", () => {
      const store = useGameStore();
      store.put(3, 2);
      store.startGame({ allowUndo: false });
      expect(store.current).toBe("黒の手番");
    });

    it("startGame を呼ぶと lastPassed が null になる", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.turn = CellState.Black;
      store.put(0, 0);
      store.startGame({ allowUndo: false });
      expect(store.lastPassed).toBeNull();
    });

    it("startGame を呼ぶとゲームオーバーが解除される", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.startGame({ allowUndo: false });
      expect(store.isGameOver).toBe(false);
    });
  });

  describe("allowUndo / startGame", () => {
    it("allowUndo のデフォルト値は false", () => {
      const store = useGameStore();
      expect(store.allowUndo).toBe(false);
    });

    it("startGame({ allowUndo: true }) を呼ぶと allowUndo が true になる", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      expect(store.allowUndo).toBe(true);
    });

    it("startGame({ allowUndo: false }) を呼ぶと allowUndo が false のまま", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: false });
      expect(store.allowUndo).toBe(false);
    });

    it("startGame を呼ぶと盤面が初期状態（黒2・白2）に戻る", () => {
      const store = useGameStore();
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.startGame({ allowUndo: false });
      expect(store.board.blacks).toBe(2);
      expect(store.board.whites).toBe(2);
    });

    it("allowUndo: false のとき、put 後も canUndo は false", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: false });
      store.put(3, 2);
      expect(store.canUndo).toBe(false);
    });

    it("allowUndo: true のとき、初期状態では canUndo は false", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      expect(store.canUndo).toBe(false);
    });

    it("allowUndo: true のとき、put 後に canUndo が true になる", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(3, 2);
      expect(store.canUndo).toBe(true);
    });

    it("allowUndo: true のとき、undo() を呼ぶと盤面が1手前に戻る", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      const blacksBefore = store.board.blacks;
      store.put(3, 2);
      store.undo();
      expect(store.board.blacks).toBe(blacksBefore);
    });

    it("allowUndo: true のとき、undo() を呼ぶと手番が1手前に戻る", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(3, 2); // 黒が打つ → 白の手番
      store.undo();
      expect(store.current).toBe("黒の手番");
    });

    it("allowUndo: true のとき、undo() 後に canUndo が false になる（履歴が空）", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(3, 2);
      store.undo();
      expect(store.canUndo).toBe(false);
    });

    it("allowUndo: true のとき、無効なマス（石が置けない）をクリックしても canUndo は false のまま", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(0, 0); // 初期盤面で (0,0) は置けない無効な手
      expect(store.canUndo).toBe(false);
    });

    it("allowUndo: true のとき、有効な手の後に無効なマスをクリックしても履歴は増えない", () => {
      const store = useGameStore();
      store.startGame({ allowUndo: true });
      store.put(3, 2); // 有効な手
      store.put(0, 0); // 無効な手
      store.undo(); // 1回 undo
      expect(store.canUndo).toBe(false); // 履歴が空になっているはず
    });
  });

  describe("lastPassed", () => {
    it("初期状態では null", () => {
      const store = useGameStore();
      expect(store.lastPassed).toBeNull();
    });

    it("パスが発生しない通常の手では null のまま", () => {
      const store = useGameStore();
      store.put(3, 2);
      expect(store.lastPassed).toBeNull();
    });

    it("オートパスが発生したとき、パスされた側の色が入る", () => {
      const store = useGameStore();
      // 黒が (0,0) に置いたら白がパスになるが、ゲームオーバーではない盤面を作る
      // (0,0)=空き、(0,1)=白、(0,2)=黒 → 黒は (0,0) に置ける
      // (0,3)=空き、(0,4)=白、(0,5)=黒 → put 後も黒は (0,3) に置けるのでゲームオーバーにならない
      // 残りはすべて黒
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      // (0,2) は黒のまま
      store.board.rows[0].cells[3].state = CellState.None;
      store.board.rows[0].cells[4].state = CellState.White;
      // (0,5) は黒のまま
      store.board.turn = CellState.Black;

      store.put(0, 0); // 黒 → (0,1) 反転 → 白は置けずパス → 黒の手番に戻る（ゲームオーバーなし）

      expect(store.isGameOver).toBe(false); // ゲームオーバーでないことを保証
      expect(store.lastPassed).toBe(CellState.White);
    });

    it("ゲームオーバーと同時にオートパスが発生しても lastPassed は null になる", () => {
      const store = useGameStore();
      // 全マス黒で埋め (0,0) だけ空け、(1,0) を白にする
      // → 黒が (0,0) に置く → (1,0) が反転 → 全マス黒 → ゲームオーバー
      store.board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      store.board.rows[0].cells[0].state = CellState.None;
      store.board.rows[0].cells[1].state = CellState.White;
      store.board.turn = CellState.Black;

      store.put(0, 0);

      expect(store.isGameOver).toBe(true); // ゲームオーバーであることを保証
      expect(store.lastPassed).toBeNull(); // パス通知は出さない
    });
  });
});
