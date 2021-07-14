export class Board {
  public rows: Row[];

  constructor() {
    // 8個作る
    this.rows = [...Array(8).keys()].map((i) => new Row(i));
    // オセロの最初の４つの石
    this.rows[3].cells[3].state = CellState.White;
    this.rows[4].cells[4].state = CellState.White;
    this.rows[4].cells[3].state = CellState.Black;
    this.rows[3].cells[4].state = CellState.Black;
  }

  // 盤面の押した箇所を黒にする
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public put(x: number, y: number) {
    this.rows[y].cells[x].state = CellState.Black;
  }
}

// 上から下までの行
export class Row {
  // Rowは８つのcellを持つ
  public cells: Cell[];
  public num: number;

  constructor(rowNumber: number) {
    // 自分が何行目かの情報を表す
    this.num = rowNumber;
    this.cells = [...Array(8).keys()].map((i) => new Cell(i, rowNumber));
  }
}

// 左から右の列
export class Cell {
  public x: number;
  public y: number;
  public state: CellState = CellState.None;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get isBlack(): boolean {
    return this.state === CellState.Black;
  }

  public get isWhite(): boolean {
    return this.state === CellState.White;
  }
}

// オセロの状態管理
export enum CellState {
  White = "white",
  Black = "black",
  None = "none",
}
