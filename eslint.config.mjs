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
const NO_EMIT_MESSAGE =
  "emit で親へデータを渡さない。子は Pinia ストアのアクションを直接呼ぶこと" +
  "（.claude/skills/vue-component-rules/SKILL.md）。" +
  "例外が必要なら本ファイルに files スコープと理由を書いて許可する。";

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
  {
    // 子から親へのデータ伝搬を emit ではなく Pinia アクションで行う設計を lint で固定する。
    // ドキュメント（.claude/skills/vue-component-rules）だけでは破っても何も落ちず、
    // VCell → VRow → VBoard → VGame の emit 連鎖が静かに復活しうるため。
    //
    // Vue は emit の宣言経路が複数あり、1 つ塞いでも別経路が残る。
    // 特に Options API の emits オプションは vue/require-explicit-emits を
    // 満たしてしまうため、宣言側を塞がないとテンプレートの $emit も通る（#392 codex 指摘）。
    files: ["src/**/*.vue"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          // <script setup> の宣言
          selector: "CallExpression[callee.name='defineEmits']",
          message: NO_EMIT_MESSAGE,
        },
        {
          // defineModel は update:modelValue を暗黙に emit する
          selector: "CallExpression[callee.name='defineModel']",
          message: NO_EMIT_MESSAGE,
        },
        {
          // Options API / defineComponent の emits オプション。
          // key.name は Identifier キーにしか一致せず、{ "emits": [...] } や
          // { ["emits"]: [...] } は Literal キーなので key.value 側でも拾う。
          // Vue も vue/require-explicit-emits もクォートキーを emits 宣言として
          // 扱うため、片方だけだと宣言もテンプレートの $emit も素通りする（#400 codex 指摘）
          selector: "Property[key.name='emits'], Property[key.value='emits']",
          message: NO_EMIT_MESSAGE,
        },
        {
          // setup(props, ctx) の ctx.emit / Options API の this.$emit
          selector: "MemberExpression[property.name=/^\\$?emit$/]",
          message: NO_EMIT_MESSAGE,
        },
        {
          // setup(props, { emit }) の分割代入
          selector: "ObjectPattern > Property[key.name='emit']",
          message: NO_EMIT_MESSAGE,
        },
      ],
      // テンプレートの $emit は core の no-restricted-syntax が到達しないため、
      // vue プラグイン側で塞ぐ。上で宣言経路を全て禁止しているので、
      // テンプレートの $emit は常に「未宣言」となりここで落ちる
      "vue/require-explicit-emits": "error",
    },
  },
);
