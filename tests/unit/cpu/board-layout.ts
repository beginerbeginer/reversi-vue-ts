import { Board, CellState } from "@/models/reversi";

// 文字列レイアウトから盤面を組む。B=黒 W=白 .=空
export function setBoard(board: Board, layout: string[]): void {
  const map: Record<string, CellState> = {
    B: CellState.Black,
    W: CellState.White,
    ".": CellState.None,
  };
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      board.rows[y].cells[x].state = map[layout[y][x]];
    }
  }
}
