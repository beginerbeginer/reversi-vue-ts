import { describe, it, expect } from "vitest";
import { Board, CellState, Point } from "@/models/reversi";

describe("Board / search()", () => {
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
    // rows[p.y].cells[p.x] のため (0,2) = rows[2].cells[0]
    board.rows[2].cells[0].state = CellState.White;
    board.turn = CellState.Black;
    // (0,1) から下: (0,2)=White, (0,3)=None → 先に自石なしで挟めない
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

  it("8方向すべてに挟める盤面では、各方向の相手石8つを返す", () => {
    const board = new Board();
    board.rows.forEach((row) =>
      row.cells.forEach((cell) => (cell.state = CellState.None)),
    );
    // 中心 (4,4) を空にし、8方向それぞれ距離1に白・距離2に黒を置く。
    // 黒番で (4,4) に置くと全方向で1つずつ挟め、白8つが返るはず
    const dirs = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];
    for (const [dx, dy] of dirs) {
      board.rows[4 + dy].cells[4 + dx].state = CellState.White;
      board.rows[4 + dy * 2].cells[4 + dx * 2].state = CellState.Black;
    }
    board.turn = CellState.Black;
    const result = board.search(new Point(4, 4));
    expect(result).toHaveLength(8);
    for (const [dx, dy] of dirs) {
      expect(result).toContainEqual(
        expect.objectContaining({ x: 4 + dx, y: 4 + dy }),
      );
    }
  });
});
