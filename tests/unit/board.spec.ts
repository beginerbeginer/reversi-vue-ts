import { Board, Point, CellState } from "@/models/reversi";

describe("Board.put", () => {
  it("flips opponent stones and switches turn", () => {
    const board = new Board();
    // Place a black stone at (2,3) which should flip (3,3) from white to black
    board.put(new Point(2, 3));
    expect(board.ref(new Point(3, 3)).state).toBe(CellState.Black);
    expect(board.ref(new Point(2, 3)).state).toBe(CellState.Black);
    // Turn should pass to white after a valid move
    expect(board.turn).toBe(CellState.White);
  });
});

describe("Board.shouldPass", () => {
  it("returns true when current player has no valid moves", () => {
    const board = new Board();
    // Fill the board with black stones so white has no moves
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        board.rows[y].cells[x].state = CellState.Black;
      }
    }
    board.turn = CellState.White;
    expect(board.shouldPass()).toBe(true);
  });

  it("returns false when current player has a valid move", () => {
    const board = new Board();
    expect(board.shouldPass()).toBe(false);
  });
});
