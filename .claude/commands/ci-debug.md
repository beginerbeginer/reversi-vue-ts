# CI 失敗時の調査・修正フロー

CI が失敗したとき、どのジョブが落ちたかを特定してローカルで再現し、修正してから push する。

## Step 1：どのジョブが落ちたか確認する

PR のコメントに届く CI テーブルを見る：

| グループ | 失敗例 |
|---------|-------|
| ❌ Lint Check | audit / type-check / lint のいずれか |
| ❌ Test & Build | テスト失敗 / ビルドエラー |

GitHub Actions のログは以下で確認：

```bash
gh run list --repo beginerbeginer/reversi-vue-ts --limit 5
gh run view <run-id> --log-failed
```

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
```

### Test & Build グループが落ちた場合

```bash
# 1. テスト（詳細出力）
npm run test:unit -- --reporter=verbose

# 2. カバレッジ閾値確認
npm run test:coverage

# 3. ビルド
npm run build
```

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
npm run test:unit -- --reporter=verbose 2>&1 | grep -A 10 "FAIL"

# 特定のファイルだけ
npm run test:unit -- tests/unit/reversi.spec.ts
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

## Step 4：修正後の確認

push 前にローカルで CI と同じ手順を全部通す：

```bash
npm audit --audit-level=high && \
npm run type-check && \
npm run lint && \
npm run test:coverage && \
npm run build && \
echo "✅ 全チェック通過"
```

全部 ✅ になったらコミット・push する。

---

## Step 5：それでも原因がわからないとき

1. GitHub Actions のログ全文をコピーしてチャットに貼る
2. 「どのステップで落ちているか」「エラーメッセージ」を伝える
3. ローカルでは通るのに CI では落ちる場合は Node.js バージョンを確認：
   ```bash
   node -v   # CI は Node.js 22 を使用
   ```
