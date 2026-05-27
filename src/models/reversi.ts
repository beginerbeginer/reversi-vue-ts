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
    if (!this.ref(p).isNone) {
      return;
    }

    // ひっくり返せる石がない場合
    const reversedList = this.search(p);

    if (reversedList.length === 0) {
      return;
    }

    // 石をひっくり返す（配列内の要素の石の色を置いた石の色に変更する）
    reversedList.forEach((p) => (this.ref(p).state = this.turn));

    // 最初は黒石を置く
    this.ref(p).state = this.turn;

    this.next();

    if (this.shouldPass()) {
      this.next();
    }
  }

  // 石の座標を参照する
  public ref(p: Point): Cell {
    return this.rows[p.y].cells[p.x];
  }

  public next(): void {
    if (this.turn === CellState.Black) {
      this.turn = CellState.White;
    } else {
      this.turn = CellState.Black;
    }
  }

  // 隣の石がひっくり返せるか探索
  public search(p: Point): Point[] {
    if (!this.ref(p).isNone) return [];

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    /**
     * @param _p  :探索対象の座標
     * @param next:次の座標を受け取る関数
     * @param lst :リスト
     */
    const _search = (
      _p: Point,
      next: (pre: Point) => Point,
      lst: Point[],
    ): Point[] => {
      const _next = next(_p);

      if (!_next.inBoard || self.ref(_next).isNone) {
        return [];
      }
      if (self.ref(_next).state !== self.turn) {
        lst.push(_next);
        return _search(_next, next, lst);
      }
      return lst;
    };
    let result: Point[] = [];

    // 石を置いたマスの周囲を探索
    result = result.concat(_search(p, (p) => new Point(p.x, p.y + 1), []));
    result = result.concat(_search(p, (p) => new Point(p.x, p.y - 1), []));
    result = result.concat(_search(p, (p) => new Point(p.x + 1, p.y), []));
    result = result.concat(_search(p, (p) => new Point(p.x - 1, p.y), []));
    result = result.concat(_search(p, (p) => new Point(p.x + 1, p.y + 1), []));
    result = result.concat(_search(p, (p) => new Point(p.x - 1, p.y + 1), []));
    result = result.concat(_search(p, (p) => new Point(p.x + 1, p.y - 1), []));
    result = result.concat(_search(p, (p) => new Point(p.x - 1, p.y - 1), []));
    return result;
  }

  public get blacks(): number {
    let count = 0;
    this.rows.forEach((row) => {
      count += row.blacks;
    });
    return count;
  }

  public get whites(): number {
    let count = 0;
    this.rows.forEach((row) => {
      count += row.whites;
    });
    return count;
  }

  public validMoves(): Point[] {
    const moves: Point[] = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.search(new Point(x, y)).length > 0) {
          moves.push(new Point(x, y));
        }
      }
    }
    return moves;
  }

  // パスのロジック：全マスを検索、ひっくり返せるマスがなければ飛ばす
  public shouldPass(): boolean {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const reversedList = this.search(new Point(i, j));
        if (reversedList.length > 0) {
          return false;
        }
      }
    }
    return true;
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

  public get blacks(): number {
    let count = 0;
    this.cells.forEach((cell) => {
      if (cell.isBlack) count++;
    });
    return count;
  }

  public get whites(): number {
    let count = 0;
    this.cells.forEach((cell) => {
      if (cell.isWhite) count++;
    });
    return count;
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

  // ボードの外を探索した場合
  public get inBoard(): boolean {
    return 0 <= this.x && this.x <= 7 && 0 <= this.y && this.y <= 7;
  }
}

// オセロの状態管理
export enum CellState {
  White = "white",
  Black = "black",
  None = "none",
}
