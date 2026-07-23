import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import pluginVueA11y from "eslint-plugin-vuejs-accessibility";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

// ESLint 10 はフラットコンフィグ（eslint.config.*）必須で旧 .eslintrc.js を読めない。
// .eslintrc.js の extends/rules をそのままフラット形式へ移植している

// TypeScript は 7 が出ているが 6 系に留めている。TS7 が JS API を出荷しておらず、
// それを使う vueTsConfigs（内部で typescript-eslint）も vue-tsc も動かないため（#369 / #370）。
// peer を無視して強行すると ESLint も型チェックも起動時に落ちるので --force は採らない。
// oxlint や Biome への乗り換えでも解決しない（型情報ルールが .vue で使えない）
export default defineConfigWithVueTs(
  {
    // build 成果物や生成 JS（npm run clean 対象）は lint しない
    ignores: ["dist/**", "coverage/**", "src/**/*.js"],
  },
  {
    // 旧 .eslintrc.js の env.node 相当。設定ファイル自身やビルドスクリプトの
    // process 等を解決するため、全ファイルへ node グローバルを与える
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
  js.configs.recommended,
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  ...pluginVueA11y.configs["flat/recommended"],
  skipFormatting,
  {
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      // _ プレフィックスは「意図的な未使用」を示す TypeScript の慣例。
      // 上位 CPU レベルで color を使うための統一インターフェースを維持するために必要
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // *.vue の型シムは Vue 公式のボイラープレートで {} / any が必須。
    // 型シム宣言にアプリ品質ルールを課す意味はないため declaration ファイルでは緩める
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    // E2E では Vue 内部（__vue_app__ 等）へブラウザコンテキストから到達する必要があり、
    // 公開型が無いため any キャストが避けられない
    files: ["tests/e2e/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
