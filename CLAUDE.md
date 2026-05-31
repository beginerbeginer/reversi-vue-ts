# reversi-vue-ts

Vue 3 + TypeScript で実装したリバーシゲーム。

## 技術スタック

- Vue 3 + TypeScript + Vite
- Vuetify 4（UI コンポーネント）
- Pinia（状態管理）
- Vitest（ユニット・インテグレーションテスト）
- Playwright（E2E テスト）

## コマンド

```bash
npm run dev              # 開発サーバー起動
npm run build            # 型チェック + ビルド
npm run type-check       # TypeScript 型チェック
npm run lint             # ESLint
npm run test:unit        # ユニットテスト
npm run test:integration # インテグレーションテスト
npm run test:coverage    # カバレッジ付きテスト
npm run test:e2e         # Playwright E2E テスト
```

## 開発フロー

新機能は `/new-feature` スキル、実装は `/tdd` スキル（t_wada 式 TDD）に従う。
CI 失敗時は `/ci-debug` スキルで調査する。
Vue コンポーネント設計は `/vue-component-rules` に従う。

## コミットメッセージ

Conventional Commits 形式。`commit-msg` フックで自動チェックされる。

```
<type>(<scope>): <subject>

type: feat | fix | docs | style | refactor | test | chore
```

例: `fix(board): shouldPass が両者パス時にゲームを終了しない問題を修正する`

## コードコメントのルール

**Why not** スタイルで書く。How/What はコードを見ればわかるので書かない。

```ts
// nextTick を使う。DOM 更新前に querySelector すると null になるため
```

## ブランチ・PR

- `main` への直接 push 禁止
- PR 作成 → CI 通過 → マージ
- pre-push フックで Playwright が自動実行される
