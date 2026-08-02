---
name: vue-component-rules
description: >
  このプロジェクトの Vue コンポーネント設計ルール。
  データフロー（Props→Store）、ライフサイクルの使い方、
  コンポーネントの責務分担、Pinia の使い方を含む。
when_to_use: >
  Vue コンポーネントを新規作成する、emit を使おうとしている、
  props を直接変更しようとしている、コンポーネント設計に迷ったときに参照する。
---

# Vue コンポーネント設計ルール

このプロジェクトで守るべき Vue コンポーネントの設計原則。

## データフローの鉄則

```
親 → 子: Props のみ（表示データを渡す）
子 → 親: データを渡すことは禁止
```

**禁止パターン:**
```
VCell --emit--> VRow --emit--> VBoard --emit--> VGame
（データが子から親へ連鎖する）
```

**許可パターン:**
```
VGame --props--> VBoard --props--> VRow --props--> VCell
VCell --action--> Pinia Store
（子はストアのアクションを直接呼ぶ）
```

## ライフサイクルの意識

| フェーズ | やること |
|---------|---------|
| `onMounted` | DOM が必要な初期化（スクロール位置取得など） |
| `onUnmounted` | タイマーやイベントリスナーのクリーンアップ |
| `setup` / トップレベル | リアクティブな状態・算出プロパティの定義 |

- 副作用（API 呼び出し、タイマーなど）は必ず `onMounted` 以降で行う
- `setup` 時点では DOM が存在しないことを常に意識する

## コンポーネントの責務分担

| コンポーネント | 責務 |
|-------------|------|
| ページコンポーネント（VGame など） | ストアの状態を読んで表示コンポーネントに渡す |
| 表示コンポーネント（VBoard / VRow） | Props で受け取ったデータをレンダリングするだけ |
| インタラクションコンポーネント（VCell） | ユーザー操作を受け取り、ストアのアクションを直接呼ぶ |

## ストア（Pinia）の使い方

```typescript
// ✅ 子コンポーネントがストアのアクションを直接呼ぶ
const store = useGameStore();
function onClick() { store.put(x, y); }

// ❌ emit で親にデータを渡してから親が処理する
const emit = defineEmits<{ put: [p: Point] }>();
function onClick() { emit("put", new Point(x, y)); }
```

## Props は読み取り専用

受け取った Props を直接変更しない。Vue の単方向データフローが崩れ、
どのコンポーネントが状態を変えたか追跡できなくなるため。
変更が必要な場合はストアのアクション経由で行う。

---

## emit 禁止は lint で強制されている

このルールはドキュメントだけでなく `eslint.config.mjs` で機械的に落ちる。
`src/**/*.vue` に対して、Vue が持つ emit の宣言経路を全て塞いでいる。

| ルール（セレクタ） | 塞ぐ経路 |
|--------|---------|
| `no-restricted-syntax`（`defineEmits` の呼び出し） | `<script setup>` から emit を宣言する |
| `no-restricted-syntax`（`defineModel` の呼び出し） | `update:modelValue` を暗黙に emit する |
| `no-restricted-syntax`（`emits` プロパティ。`{ "emits": ... }` / `{ ["emits"]: ... }` も含む） | Options API・`defineComponent`・`defineOptions` の `emits` オプション |
| `no-restricted-syntax`（`.emit` / `.$emit` のメンバ参照） | `setup(props, ctx)` の `ctx.emit`、Options API の `this.$emit` |
| `no-restricted-syntax`（`emit` の分割代入） | `setup(props, { emit })` |
| `vue/require-explicit-emits` | テンプレートから未宣言の `$emit` を呼ぶ |

宣言経路を全て禁止しているため、テンプレートの `$emit` は常に「未宣言」となり
`vue/require-explicit-emits` で落ちる。逆に宣言経路が 1 つでも通ると、
`emits` を宣言したことでこのルールが満たされ、テンプレートの `$emit` まで通る（#392 / #400）。

`npm run lint` で error になるため、CI（Lint Check グループ）で落ちる。
6 経路が実際に error になることは `tests/unit/lint/no-emit.spec.ts` で検証している。

### 例外が必要になったら

インラインの `eslint-disable` で消さないこと。理由が追跡できなくなり、
「回避の作法」として定着するため。

1. `eslint.config.mjs` に `files:` スコープを切り、**なぜ例外が必要か**をコメントで書く
   （TypeScript 側の `**/*.d.ts` や `tests/e2e/**` と同じ方式）
2. 本ファイルの下の表に、例外・理由・出典 PR を追記する

| 例外の対象 | 理由 | 出典 |
|-----------|------|------|
| （まだ無し） | | |
