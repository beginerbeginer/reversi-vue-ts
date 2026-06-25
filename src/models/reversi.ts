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

    // アロー関数なので this は search() の this（＝Board）を束縛する。
    // 通常関数だと this がずれるため self へ退避する必要があったが、不要
    const searchDirection = (dx: number, dy: number): Point[] => {
      const found: Point[] = [];
      let cur = new Point(p.x + dx, p.y + dy);
      // 相手石が続く限り集め、自分の石で閉じれば確定。
      // 盤外・空マスに当たったら挟めないので空配列
      while (cur.inBoard) {
        const cell = this.ref(cur);
        if (cell.isNone) return [];
        if (cell.state === this.turn) return found;
        found.push(cur);
        cur = new Point(cur.x + dx, cur.y + dy);
      }
      return [];
    };

    // 8方向の単位ベクトル（上下左右＋斜め4つ）
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
    ];
    return directions.flatMap(([dx, dy]) => searchDirection(dx, dy));
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

  // validMoves() を再利用する。独立した 64 マス探索を重複して書くと
  // 「置けるか」の判定ロジックが 2 箇所に分散し、片方だけ変更したときに差異が生じるため
  public shouldPass(): boolean {
    return this.validMoves().length === 0;
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
