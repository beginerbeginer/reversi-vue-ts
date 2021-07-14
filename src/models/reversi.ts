export class Board {
  public rows: Row[];
  public turn: CellState = CellState.Black;

  constructor() {
    this.rows = [...Array(8).keys()].map((i) => new Row(i));
    this.rows[3].cells[3].state = CellState.White;
    this.rows[4].cells[4].state = CellState.White;
    this.rows[4].cells[3].state = CellState.Black;
    this.rows[3].cells[4].state = CellState.Black;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public put(p: Point) {
    if (!this.rows[p.y].cells[p.x].isNone) {
      return;
    }
    this.rows[p.y].cells[p.x].state = this.turn;

    if (this.turn === CellState.Black) {
      this.turn = CellState.White;
    } else {
      this.turn = CellState.Black;
    }
  }

  public search(p: Point): Point[] {
    return [];
  }
}

// 上から下までの行
export class Row {
  public cells: Cell[];
  public num: number;

  constructor(rowNumber: number) {
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

  public get isNone(): boolean {
    return this.state === CellState.None;
  }
}

//座標クラス（石の位置情報）
export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// オセロの状態管理
export enum CellState {
  White = "white",
  Black = "black",
  None = "none",
}
