import { Board, Point, CellState } from "@/models/reversi";

// What: Board.putとBoard.shouldPassの挙動を検証する
// Why not: コンポーネントのテストは別途実施する
describe("Board.putのテスト", () => {
  it("相手の石を反転させ手番を切り替える", () => {
    const board = new Board();
    // Why not: 初期配置はBoardが行うため追加設定は不要
    // (2,3)に黒石を置くと(3,3)の白石が黒に反転する
    board.put(new Point(2, 3));
    expect(board.ref(new Point(3, 3)).state).toBe(CellState.Black);
    expect(board.ref(new Point(2, 3)).state).toBe(CellState.Black);
    // 手番は白に切り替わる
    expect(board.turn).toBe(CellState.White);
  });
});

describe("Board.shouldPassのテスト", () => {
  it("合法手が無い場合にtrueを返す", () => {
    const board = new Board();
    // Why not: 盤面はテスト内で完全に黒にする
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        board.rows[y].cells[x].state = CellState.Black;
      }
    }
    board.turn = CellState.White;
    expect(board.shouldPass()).toBe(true);
  });

  it("合法手がある場合にfalseを返す", () => {
    const board = new Board();
    expect(board.shouldPass()).toBe(false);
  });
});
