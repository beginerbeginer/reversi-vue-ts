import { defineConfig, devices } from "@playwright/test";

// 開発用 dev server の 5173 とは別のポートを使う。
// 5173 は他プロジェクトの Vite に占有されていることがあり、
// その場合 E2E が別アプリに対して実行されてしまうため (#385)
const E2E_PORT = 5273;
const BASE_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // --strictPort を付ける。付けないと Vite が別ポートへ黙ってフォールバックし、
    // baseURL が指す先が誰のサーバーか分からないままテストが走るため
    command: `npm run dev -- --port ${E2E_PORT} --strictPort`,
    url: BASE_URL,
    // 既存サーバーを再利用しない。ポートを握っているのがこのアプリである保証がなく、
    // 再利用すると別アプリ相手のテストが「アプリ側の不具合」に見えてしまうため
    reuseExistingServer: false,
    timeout: 30000,
  },
});
