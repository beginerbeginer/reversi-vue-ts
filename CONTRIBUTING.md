# コントリビューションガイド

## 開発フロー

1. `main` ブランチから feature ブランチを切る（直接 push 禁止）
2. PR を作成し、CI が通ることを確認してからマージする

## コミットメッセージの書式

[Conventional Commits](https://www.conventionalcommits.org/) に従う。
`commit-msg` フックで自動チェックされる。

```
<type>(<scope>): <subject>

type: feat | fix | docs | style | refactor | test | chore
```

例:
```
feat(game): ゲームオーバー検出を追加する
fix(board): shouldPass が両者パス時にゲームを終了しない問題を修正する
test(reversi): search() のエッジケーステストを追加する
```

## CI 失敗時の対処（/ci-debug）

### lint-check グループが失敗した場合

```bash
# 型エラーの確認
npm run type-check

# lint エラーの確認・自動修正
npm run lint -- --fix

# npm audit（高リスク脆弱性）
npm audit --audit-level=high
```

### test-build グループが失敗した場合

```bash
# テストをローカルで実行
npm run test:unit

# カバレッジつきで実行（閾値確認）
npm run test:coverage

# ビルドエラーの確認
npm run build
```

### よくある原因

| エラー | 原因 | 対処 |
|--------|------|------|
| `Type error` | TypeScript の型不一致 | `npm run type-check` でエラー箇所を特定 |
| `Parsing error` | ESLint が構文を解析できない | Node.js / ESLint バージョンを確認 |
| `Cannot find module` | import パスが間違っている | `@/` エイリアスを使う（`src/` の絶対パス） |
| `vitest` でタイムアウト | 非同期テストが終わらない | `await` や `flushPromises()` を確認 |

## ローカル環境のセットアップ

```bash
npm ci
npm run prepare   # simple-git-hooks をインストール
npm run dev       # 開発サーバー起動
```
