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

    console.log(reversedList);
    console.log("↑reversedList終了");

    if (reversedList.length === 0) {
      return;
    }

    // 石をひっくり返す（配列内の要素の石の色を置いた石の色に変更する）
    reversedList.forEach((p) => (this.ref(p).state = this.turn));

    // 最初は黒石を置く
    this.ref(p).state = this.turn;

    if (this.turn === CellState.Black) {
      this.turn = CellState.White;
    } else {
      this.turn = CellState.Black;
    }
  }

  // 石の座標を参照する
  public ref(p: Point): Cell {
    return this.rows[p.y].cells[p.x];
  }

  // 隣の石がひっくり返せるか探索
  public search(p: Point): Point[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    /**
     * @param _p  :探索対象の座標
     * @param next:次の座標を受け取る関数
     * @param lst :リスト
     */
    const _search = (_p: Point, next: (pre: Point) => Point, lst: Point[]): Point[] => {
      const _next = next(_p);

      // ボードの外を探索した場合、or、隣のマスに石がない場合
      if (!_next.inBoard || self.ref(_next).isNone) {
        console.log("ボードの外を探索した場合、or、隣のマスに石がない");
        return [];
      }
      // 隣のマスが自分の色と違う場合
      if (self.ref(_next).state !== self.turn) {
        console.log("隣のマスが自分の色と違う");
        console.log(lst.push(_next));
        console.log("↑lst.push(_next)終了");
        lst.push(_next);
        console.log("↑_next終了");
        console.log(next);
        console.log("↑next終了");
        console.log(lst);
        console.log("↑lst終了");
        // 周囲のマスを再検索する検索順は「82647319」
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
