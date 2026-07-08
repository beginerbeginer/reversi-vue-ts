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

| スキル | 使いどき |
|--------|---------|
| `/new-feature` | 新機能開発の開始 |
| `/tdd` | t_wada 式 TDD で実装する |
| `/ci-debug` | CI 失敗時の調査 |
| `/vue-component-rules` | Vue コンポーネント設計の確認 |
| `/coupling-check` | 結合度を均衡結合モデル（強度・距離・変動性）で診断する |
| `/update-rules` | セッションで決めた規約をルールとして永続化する |
| `/best-practice` | Claude Code の活用法を確認する |

コミット・ブランチ・コードコメントの規約は `.claude/rules/git-workflow.md` を参照すること。

テストファイルの構成・分割基準は `.claude/rules/test-organization.md` を参照すること。

## コマンド

| コマンド | 説明 |
|---------|------|
| `/claude-commit` | 直近コミットに Claude を co-author として追加する |
