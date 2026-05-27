import { test, expect } from "@playwright/test";

test.describe("リバーシ ゲーム画面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/game");
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
});
