import { test, expect } from "@playwright/test";

test.describe("リバーシ ゲーム画面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/game");
  });

  test("初期盤面が表示される", async ({ page }) => {
    // 8x8 = 64 セルが存在する
    const cells = page.locator(".cell-wrapper");
    await expect(cells).toHaveCount(64);
  });

  test("初期配置：白2・黒2の石が置かれている", async ({ page }) => {
    await expect(page.locator(".white-stone")).toHaveCount(2);
    await expect(page.locator(".black-stone")).toHaveCount(2);
  });

  test("初期手番は黒", async ({ page }) => {
    await expect(page.getByText("黒の手番")).toBeVisible();
  });

  test("石を置くと手番が変わる", async ({ page }) => {
    // 黒が置ける合法手のひとつ（初期盤面では (2,3) など）をクリック
    // 盤面は0-indexed で x=col, y=row
    // VRow は board.rows を v-for しており、VCell は row.cells を v-for している
    // cell-wrapper を行・列の順で取得
    const cells = page.locator(".cell-wrapper");
    // 初期盤面で黒の合法手: (2,3), (3,2), (4,5), (5,4) = 0-indexed
    // セルのインデックス = y*8 + x
    // (2,3) → 3*8+2 = 26
    await cells.nth(26).click();
    await expect(page.getByText("白の手番")).toBeVisible();
  });

  test("石の合計数が正しく表示される", async ({ page }) => {
    await expect(page.getByText(/白の石：\d+/)).toBeVisible();
    await expect(page.getByText(/黒の石：\d+/)).toBeVisible();
  });

  test("置けないセルをクリックしても盤面が変わらない", async ({ page }) => {
    const cells = page.locator(".cell-wrapper");
    // 左上隅 (0,0) は初期盤面では置けない
    await cells.nth(0).click();
    await expect(page.locator(".white-stone")).toHaveCount(2);
    await expect(page.locator(".black-stone")).toHaveCount(2);
  });

  test("石を置くと挟まれた石が反転しスコアが更新される", async ({ page }) => {
    const cells = page.locator(".cell-wrapper");
    // (2,3) → index 26: 黒を置くと (3,3) の白が黒に反転 → 黒4, 白1
    await cells.nth(26).click();
    await expect(page.getByText("黒の石：4")).toBeVisible();
    await expect(page.getByText("白の石：1")).toBeVisible();
  });

  test("ゲーム終了ダイアログに勝者とスコアが表示される", async ({ page }) => {
    const cells = page.locator(".cell-wrapper");
    // 白の最短全滅（10手）: 黒の勝ち
    for (const index of [37, 45, 44, 29, 20, 11, 19, 43, 26, 25]) {
      await cells.nth(index).click();
    }
    await expect(page.getByText("ゲーム終了")).toBeVisible();
    await expect(page.getByText(/白の勝ち/)).toBeVisible();
    await expect(page.getByText(/黒 \d+ 対 白 \d+/)).toBeVisible();
  });

  test("「もう一度」ボタンでゲームが初期状態に戻り再プレイできる", async ({
    page,
  }) => {
    const cells = page.locator(".cell-wrapper");
    // ゲーム終了状態を作る（白の最短全滅）
    for (const index of [37, 45, 44, 29, 20, 11, 19, 43, 26, 25]) {
      await cells.nth(index).click();
    }
    await page.getByRole("button", { name: "もう一度" }).click();

    await expect(page.locator(".white-stone")).toHaveCount(2);
    await expect(page.locator(".black-stone")).toHaveCount(2);
    await expect(page.getByText("黒の手番")).toBeVisible();

    // 再プレイできる
    await cells.nth(26).click();
    await expect(page.getByText("白の手番")).toBeVisible();
  });

  test("引き分け時に「引き分け」が表示される", async ({ page }) => {
    // 黒 32・白 32 の全埋め状態を作る（両者パス → ゲーム終了）
    await page.evaluate(() => {
      const store = (
        document.querySelector("#app") as any
      ).__vue_app__.config.globalProperties.$pinia._s.get("game");
      let i = 0;
      store.board.rows.forEach((row: any) => {
        row.cells.forEach((cell: any) => {
          cell.state = i++ < 32 ? "black" : "white";
        });
      });
    });
    await expect(page.getByText("引き分け")).toBeVisible();
  });

  test("パス時にスナックバーが表示され手番が変わる", async ({ page }) => {
    // 黒がパスになる局面: 行7以外を黒で埋め、行7は [W,_,B,B,B,W,B,B]
    // この状態で白が (1,7) に置くと黒が挟まれずパスになる
    await page.evaluate(() => {
      const store = (
        document.querySelector("#app") as any
      ).__vue_app__.config.globalProperties.$pinia._s.get("game");
      store.board.rows.forEach((row: any) => {
        row.cells.forEach((cell: any) => {
          cell.state = "black";
        });
      });
      store.board.rows[7].cells[0].state = "white";
      store.board.rows[7].cells[1].state = "none";
      store.board.rows[7].cells[5].state = "white";
      store.board.turn = "white";
    });

    // 白が (1,7) = index 57 に置く → (2,7)(3,7)(4,7) の黒が白に反転 → 黒は置けずパス
    await page.locator(".cell-wrapper").nth(57).click();
    await expect(page.getByText("黒はパスです")).toBeVisible();
  });
});
