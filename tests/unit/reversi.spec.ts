import { describe, it, expect } from "vitest";
import { Board, CellState, Point } from "@/models/reversi";

describe("Board", () => {
  describe("shouldPass()", () => {
    it("初期状態では黒はパスしない（有効な手が存在する）", () => {
      const board = new Board();
      expect(board.shouldPass()).toBe(false);
    });

    it("初期状態では白もパスしない（turn を切り替えて確認）", () => {
      const board = new Board();
      board.next();
      expect(board.shouldPass()).toBe(false);
    });

    it("全マスが黒石で埋まっているとき白手番ではパスになる", () => {
      const board = new Board();
      board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      board.turn = CellState.White;
      expect(board.shouldPass()).toBe(true);
    });

    it("全マスが白石で埋まっているとき黒手番ではパスになる", () => {
      const board = new Board();
      board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.White)),
      );
      board.turn = CellState.Black;
      expect(board.shouldPass()).toBe(true);
    });

    it("空きマスがあっても挟める相手石がなければパスになる", () => {
      const board = new Board();
      // 盤面を全部黒で埋めて1マスだけ空ける（黒手番では隣が全部黒なので挟めない）
      board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      board.rows[0].cells[0].state = CellState.None;
      board.turn = CellState.Black;
      expect(board.shouldPass()).toBe(true);
    });
  });

  describe("validMoves()", () => {
    it("初期状態で黒の有効手は4マスある", () => {
      const board = new Board();
      expect(board.validMoves()).toHaveLength(4);
    });

    it("初期状態の黒の有効手に (3,2) が含まれる", () => {
      const board = new Board();
      const moves = board.validMoves();
      expect(moves.some((p) => p.x === 3 && p.y === 2)).toBe(true);
    });

    it("全マスが埋まっているとき有効手は0個", () => {
      const board = new Board();
      board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.Black)),
      );
      expect(board.validMoves()).toHaveLength(0);
    });
  });

  it("初期状態で黒が2個ある", () => {
    const board = new Board();
    expect(board.blacks).toBe(2);
  });

  it("初期状態で白が2個ある", () => {
    const board = new Board();
    expect(board.whites).toBe(2);
  });

  it("黒が最初の手番である", () => {
    const board = new Board();
    expect(board.turn).toBe(CellState.Black);
  });

  it("有効な場所に石を置くと手番が切り替わる", () => {
    const board = new Board();
    board.put(new Point(3, 2));
    expect(board.turn).toBe(CellState.White);
  });

  it("有効な場所に石を置くと石数が増える", () => {
    const board = new Board();
    board.put(new Point(3, 2));
    expect(board.blacks).toBeGreaterThan(2);
  });

  describe("search()", () => {
    it("すでに石が置いてあるマスを指定すると空配列を返す", () => {
      const board = new Board();
      // 初期状態で (3,3) は白石
      expect(board.search(new Point(3, 3))).toHaveLength(0);
    });

    it("隣に相手石がない場合は空配列を返す", () => {
      const board = new Board();
      // (0,0) は空で、隣に石がない
      expect(board.search(new Point(0, 0))).toHaveLength(0);
    });

    it("相手石の先に自分の石がない（挟めない）場合は空配列を返す", () => {
      const board = new Board();
      // (3,1) の下に (3,2)=None → (3,3)=White だが (3,4)=Black なので挟める
      // 代わりに (5,3) を指定: 右に白石なし、下に黒石 (4,3) のみ
      // 盤面を操作して「相手石の先が盤外」になるケースを作る
      // (0,1) の下に (0,2)=White のみ（先が (0,3)=None）
      board.rows[0].cells[1].state = CellState.None;
      board.rows[0].cells[2].state = CellState.White;
      board.turn = CellState.Black;
      // (0,1) から下: White, None → 挟めない（先に自石なし）
      expect(board.search(new Point(0, 1))).toHaveLength(0);
    });

    it("下方向に相手石1つを挟める場合、その座標を返す", () => {
      const board = new Board();
      // 初期配置: (3,3)=White, (3,4)=Black
      // 黒番で (3,2) に置く → 下: (3,3)=White → (3,4)=Black で挟める
      expect(board.search(new Point(3, 2))).toContainEqual({ x: 3, y: 3 });
    });

    it("上方向に相手石1つを挟める場合、その座標を返す", () => {
      const board = new Board();
      // 初期配置: (3,4)=Black, (3,3)=White
      // 白番で (3,5) に置く → 上: (3,4)=Black → (3,3)=White で挟める
      board.turn = CellState.White;
      expect(board.search(new Point(3, 5))).toContainEqual({ x: 3, y: 4 });
    });

    it("右方向に相手石1つを挟める場合、その座標を返す", () => {
      const board = new Board();
      // 初期配置: (3,3)=White, (4,3)=Black
      // 黒番で (2,3) に置く → 右: (3,3)=White → (4,3)=Black で挟める
      expect(board.search(new Point(2, 3))).toContainEqual({ x: 3, y: 3 });
    });

    it("左方向に相手石1つを挟める場合、その座標を返す", () => {
      const board = new Board();
      // 初期配置: (4,3)=Black, (3,3)=White
      // 白番で (5,3) に置く → 左: (4,3)=Black → (3,3)=White で挟める
      board.turn = CellState.White;
      expect(board.search(new Point(5, 3))).toContainEqual({ x: 4, y: 3 });
    });

    it("斜め方向に相手石1つを挟める場合、その座標を返す", () => {
      const board = new Board();
      // カスタム配置: (3,3)=White, (4,4)=Black、黒番で (2,2) に置く
      // 斜め右下: (3,3)=White → (4,4)=Black で挟める
      board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.None)),
      );
      board.rows[3].cells[3].state = CellState.White;
      board.rows[4].cells[4].state = CellState.Black;
      board.turn = CellState.Black;
      expect(board.search(new Point(2, 2))).toContainEqual({ x: 3, y: 3 });
    });

    it("1方向に複数の相手石を挟める場合、すべての座標を返す", () => {
      const board = new Board();
      // 縦に白2つを挟む: (3,2)=White, (3,3)=White, (3,4)=Black
      // 黒番で (3,1) に置く → 下: (3,2)=White, (3,3)=White → (3,4)=Black
      // rows[y].cells[x] なので (x=3, y=2) は rows[2].cells[3]
      board.rows[2].cells[3].state = CellState.White;
      expect(board.search(new Point(3, 1))).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ x: 3, y: 2 }),
          expect.objectContaining({ x: 3, y: 3 }),
        ]),
      );
      expect(board.search(new Point(3, 1))).toHaveLength(2);
    });

    it("複数方向に挟める場合、すべての方向の座標を合わせて返す", () => {
      const board = new Board();
      // カスタム配置: 黒番で (2,3) が右方向と下方向に同時に挟める盤面
      // 右: (3,3)=White → (4,3)=Black
      // 下: (2,4)=White → (2,5)=Black
      board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.None)),
      );
      board.rows[3].cells[3].state = CellState.White;
      board.rows[3].cells[4].state = CellState.Black;
      board.rows[4].cells[2].state = CellState.White;
      board.rows[5].cells[2].state = CellState.Black;
      board.turn = CellState.Black;
      const result = board.search(new Point(2, 3));
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ x: 3, y: 3 }),
          expect.objectContaining({ x: 2, y: 4 }),
        ]),
      );
      expect(result).toHaveLength(2);
    });

    it("盤の端では盤外を探索しない（境界条件）", () => {
      const board = new Board();
      // 左上角 (0,0) に置いたとき、盤外方向に向けてクラッシュしない
      // (1,0)=White, (2,0)=Black → 右方向のみ有効
      board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.None)),
      );
      board.rows[0].cells[1].state = CellState.White;
      board.rows[0].cells[2].state = CellState.Black;
      board.turn = CellState.Black;
      const result = board.search(new Point(0, 0));
      expect(result).toEqual([expect.objectContaining({ x: 1, y: 0 })]);
    });

    it("初期状態で黒が (3,2) に置くと白石 (3,3) が返る", () => {
      const board = new Board();
      const result = board.search(new Point(3, 2));
      expect(result).toEqual([expect.objectContaining({ x: 3, y: 3 })]);
    });
  });

  describe("端・角への配置（境界エッジケース）", () => {
    // 各テストで盤面をクリアして必要な石だけ配置するヘルパー的な前処理
    const clearBoard = (board: Board) =>
      board.rows.forEach((row) =>
        row.cells.forEach((cell) => (cell.state = CellState.None)),
      );

    it("左上角 (0,0) に石を置いたとき、右方向の石が正しく反転する", () => {
      const board = new Board();
      clearBoard(board);
      // (1,0)=White, (2,0)=Black → 黒で (0,0) に置くと (1,0) が反転
      board.rows[0].cells[1].state = CellState.White;
      board.rows[0].cells[2].state = CellState.Black;
      board.turn = CellState.Black;
      board.put(new Point(0, 0));
      expect(board.ref(new Point(0, 0)).isBlack).toBe(true);
      expect(board.ref(new Point(1, 0)).isBlack).toBe(true);
    });

    it("右上角 (7,0) に石を置いたとき、左方向の石が正しく反転する", () => {
      const board = new Board();
      clearBoard(board);
      // (6,0)=White, (5,0)=Black → 黒で (7,0) に置くと (6,0) が反転
      board.rows[0].cells[6].state = CellState.White;
      board.rows[0].cells[5].state = CellState.Black;
      board.turn = CellState.Black;
      board.put(new Point(7, 0));
      expect(board.ref(new Point(7, 0)).isBlack).toBe(true);
      expect(board.ref(new Point(6, 0)).isBlack).toBe(true);
    });

    it("左下角 (0,7) に石を置いたとき、上方向の石が正しく反転する", () => {
      const board = new Board();
      clearBoard(board);
      // (0,6)=White, (0,5)=Black → 黒で (0,7) に置くと (0,6) が反転
      board.rows[6].cells[0].state = CellState.White;
      board.rows[5].cells[0].state = CellState.Black;
      board.turn = CellState.Black;
      board.put(new Point(0, 7));
      expect(board.ref(new Point(0, 7)).isBlack).toBe(true);
      expect(board.ref(new Point(0, 6)).isBlack).toBe(true);
    });

    it("右下角 (7,7) に石を置いたとき、左方向の石が正しく反転する", () => {
      const board = new Board();
      clearBoard(board);
      // (6,7)=White, (5,7)=Black → 黒で (7,7) に置くと (6,7) が反転
      board.rows[7].cells[6].state = CellState.White;
      board.rows[7].cells[5].state = CellState.Black;
      board.turn = CellState.Black;
      board.put(new Point(7, 7));
      expect(board.ref(new Point(7, 7)).isBlack).toBe(true);
      expect(board.ref(new Point(6, 7)).isBlack).toBe(true);
    });

    it("上端 (y=0) の辺に置くとき、盤外（y=-1）方向を探索しない", () => {
      const board = new Board();
      clearBoard(board);
      // (3,0) に置く: 下方向 (3,1)=White → (3,2)=Black のみ有効
      board.rows[1].cells[3].state = CellState.White;
      board.rows[2].cells[3].state = CellState.Black;
      board.turn = CellState.Black;
      const result = board.search(new Point(3, 0));
      expect(result).toEqual([expect.objectContaining({ x: 3, y: 1 })]);
    });

    it("下端 (y=7) の辺に置くとき、盤外（y=8）方向を探索しない", () => {
      const board = new Board();
      clearBoard(board);
      // (3,7) に置く: 上方向 (3,6)=White → (3,5)=Black のみ有効
      board.rows[6].cells[3].state = CellState.White;
      board.rows[5].cells[3].state = CellState.Black;
      board.turn = CellState.Black;
      const result = board.search(new Point(3, 7));
      expect(result).toEqual([expect.objectContaining({ x: 3, y: 6 })]);
    });

    it("左端 (x=0) の辺に置くとき、盤外（x=-1）方向を探索しない", () => {
      const board = new Board();
      clearBoard(board);
      // (0,3) に置く: 右方向 (1,3)=White → (2,3)=Black のみ有効
      board.rows[3].cells[1].state = CellState.White;
      board.rows[3].cells[2].state = CellState.Black;
      board.turn = CellState.Black;
      const result = board.search(new Point(0, 3));
      expect(result).toEqual([expect.objectContaining({ x: 1, y: 3 })]);
    });

    it("右端 (x=7) の辺に置くとき、盤外（x=8）方向を探索しない", () => {
      const board = new Board();
      clearBoard(board);
      // (7,3) に置く: 左方向 (6,3)=White → (5,3)=Black のみ有効
      board.rows[3].cells[6].state = CellState.White;
      board.rows[3].cells[5].state = CellState.Black;
      board.turn = CellState.Black;
      const result = board.search(new Point(7, 3));
      expect(result).toEqual([expect.objectContaining({ x: 6, y: 3 })]);
    });
  });
});
