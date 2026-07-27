---
name: ci-debug
description: >
  CI パイプラインの失敗を調査・修正するフロー。
  GitHub Actions のログ確認、ローカル再現手順、よくある原因と修正方法を含む。
when_to_use: >
  CI が落ちた、ビルドエラーが出た、テストが通らない、lint エラーが出た、
  knip が失敗した、型エラーが CI で出た、という状況で参照する。
---

# CI 失敗時の調査・修正フロー

CI が失敗したとき、どのジョブが落ちたかを特定してローカルで再現し、修正してから push する。

## Step 1：どのジョブが落ちたか確認する

PR のコメントに届く CI テーブルを見る：

| グループ | 失敗例 |
|---------|-------|
| ❌ Lint Check | audit / type-check / lint / knip のいずれか |
| ❌ Test & Build | テスト失敗 / インテグレーションテスト失敗 / ビルドエラー |

GitHub Actions のログは以下で確認：

```bash
gh run list --limit 5
gh run view <run-id> --log-failed
```

> `--repo` は付けない。カレントリポジトリで解決されるため不要で、fork や worktree で
> 別リポジトリを指してしまう。

### E2E はこの範囲に含まれない

`e2e.yml` は `workflow_dispatch` のみで、他のワークフローからも呼ばれていない。
**E2E は CI で自動実行されない**ため、CI の失敗として現れることはない
（`a11y.yml` が `tests/e2e/a11y.spec.ts` のみを、当該ファイル変更時に実行する）。
E2E の自動ゲートは pre-push フックだけなので、E2E が疑わしいときは
`npm run test:e2e` をローカルで実行して確認する。

---

## Step 2：ローカルで再現する

### Lint Check グループが落ちた場合

```bash
# 1. 脆弱性チェック（high 以上）
npm audit --audit-level=high

# 2. 型チェック
npm run type-check

# 3. lint
npm run lint

# 4. 未使用コード検出
npm run knip
```

### Test & Build グループが落ちた場合

```bash
# 1. テスト（詳細出力）
npm run test:unit -- --run --reporter=verbose

# 2. インテグレーションテスト
npm run test:integration -- --run

# 3. カバレッジ閾値確認
npm run test:coverage

# 4. ビルド
npm run build
```

> `--run` を明示する。CI 再現が目的なので実行モードを固定したい。
> 非 TTY では付けなくても 1 回で終了するが、ターミナルから手動実行するとウォッチに入る。

---

## Step 3：よくある原因と修正方法

### `npm audit` が落ちた

```bash
npm audit --audit-level=high   # 詳細確認
npm audit fix                  # 自動修正を試みる
```

自動修正できない場合は該当パッケージのアップデートを検討。

### 型エラー（type-check）

```bash
npm run type-check 2>&1 | head -50   # 最初のエラーを見る
```

- `undefined` の可能性がある変数 → Optional chaining (`?.`) や型ガードで対処
- import パスのミス → `@/` エイリアスを使っているか確認

### lint エラー

```bash
npm run lint -- --fix   # 自動修正できるものは修正
npm run lint            # 残ったエラーを確認
```

### テスト失敗

```bash
# 失敗したテストだけ実行
npm run test:unit -- --run --reporter=verbose 2>&1 | grep -A 10 "FAIL"

# 特定のファイルだけ
npm run test:unit -- --run tests/unit/reversi/board.search.spec.ts
```

Pinia ストアのテストが落ちる場合は `beforeEach` に以下があるか確認：

```typescript
beforeEach(() => {
  setActivePinia(createPinia());
});
```

### ビルド失敗

```bash
npm run build 2>&1 | tail -30   # エラー箇所を確認
```

- 型エラーでビルドが落ちることが多い → `npm run type-check` で先に確認
- 未使用の import → lint で検出されるはずなので lint も確認

---

## Step 4：push 前の最終確認

CI と同じ手順をローカルで通す。CI で落ちてから修正するとレビュアーへの通知が増え、
無駄なコミットも積み重なるため、push 前に全チェックを通す：

```bash
npm audit --audit-level=high && \
npm run type-check && \
npm run lint && \
npm run knip && \
npm run test:integration -- --run && \
npm run test:coverage && \
npm run build && \
echo "✅ 全チェック通過"
```

> `test:unit` は独立して並べない。`test:coverage` がデフォルト設定
> （`include: tests/unit/**/*.spec.ts`）で走るため、ユニットテストを包含している。
>
> E2E はこのチェーンに含まれない。pre-push フックが担当する。

---

## Step 5：それでも原因がわからないとき

1. GitHub Actions のログ全文をコピーしてチャットに貼る
2. 「どのステップで落ちているか」「エラーメッセージ」を伝える
3. ローカルでは通るのに CI では落ちる場合は Node.js バージョンを確認：
   ```bash
   node -v   # CI は Node.js 22 を使用
   ```
