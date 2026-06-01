import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("a11y: WCAG 自動チェック", () => {
  test("スタート画面に WCAG 違反がない", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("ゲーム画面に WCAG 違反がない", async ({ page }) => {
    await page.goto("/#/game");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("ゲーム終了ダイアログに WCAG 違反がない", async ({ page }) => {
    await page.goto("/#/game");
    const cells = page.locator(".cell-wrapper");
    for (const index of [37, 45, 44, 29, 20, 11, 19, 43, 26, 25]) {
      await cells.nth(index).click();
    }
    await expect(page.getByText("ゲーム終了")).toBeVisible();
    // canvas-confetti が body 直下に <canvas> を挿入する。
    // サードパーティ要素のため landmark チェック（region ルール）の対象から除外する
    const results = await new AxeBuilder({ page }).exclude("canvas").analyze();
    expect(results.violations).toEqual([]);
  });
});
