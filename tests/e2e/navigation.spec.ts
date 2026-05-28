import { test, expect } from "@playwright/test";

test.describe("ナビゲーション", () => {
  test("トップページからゲーム画面へ遷移できる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "ゲームスタート！！" }).click();
    await expect(page.locator(".cell-wrapper")).toHaveCount(64);
  });

  test("/#/game に直接アクセスするとゲーム画面が表示される", async ({
    page,
  }) => {
    await page.goto("/#/game");
    await expect(page.locator(".cell-wrapper")).toHaveCount(64);
  });
});
