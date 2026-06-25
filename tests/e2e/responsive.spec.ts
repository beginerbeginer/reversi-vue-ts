import { test, expect } from "@playwright/test";

// iPhone SE 3rd 世代の CSS ビューポート（論理ピクセル）
const IPHONE_SE_3RD = { width: 375, height: 667 };

test.describe("狭幅画面（iPhone SE 3rd）でのレスポンシブ", () => {
  test.use({ viewport: IPHONE_SE_3RD });

  test("スタート画面で横スクロールが発生しない", async ({ page }) => {
    await page.goto("/#/");
    const overflowX = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    // サブピクセル丸め分の 1px は許容する
    expect(overflowX).toBeLessThanOrEqual(1);
  });

  test("ゲーム画面で盤面がビューポート幅に収まる", async ({ page }) => {
    await page.goto("/#/game");

    const overflowX = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflowX).toBeLessThanOrEqual(1);

    // 盤面そのものがビューポート幅以内に収まること
    const board = page.locator(".board");
    const box = await board.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(IPHONE_SE_3RD.width);
  });

  test("セルが正方形を保つ", async ({ page }) => {
    await page.goto("/#/game");
    const firstCell = page.locator(".cell-wrapper").first();
    const box = await firstCell.boundingBox();
    expect(box).not.toBeNull();
    // aspect-ratio: 1 により縦横がほぼ等しい（丸め 1px 許容）
    expect(Math.abs(box!.width - box!.height)).toBeLessThanOrEqual(1);
  });
});
