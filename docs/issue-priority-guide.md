# 120 issue 優先順位付けガイド（ジュニア向け）

## 現状確認

| 項目 | 状態 | ファイル |
|------|------|---------|
| CI（lint-check / test-build / report） | ✅ 完成 | `.github/workflows/ci.yml` 他 |
| TypeScript `strict: true` | ✅ 済み | `tsconfig.json` |
| pre-commit hook（lint-staged + simple-git-hooks） | ✅ 済み | `package.json` |
| Vitest + @vitest/coverage-v8 | ✅ 済み | `package.json` |
| 基本テスト（Board / Row / Cell / Store） | ✅ 5ファイル存在 | `tests/unit/` |

「まだない」もの：

- ゲームオーバー検出（`Board.isGameOver()` が未実装）
- `shouldPass()` が「双方置けない = ゲーム終了」を判定していない
- リセットボタン、結果画面、ハイライトなど UI 機能
- Branch protection / Required status checks（GitHub Settings での設定）
- CODEOWNERS、PR テンプレート、issue テンプレート、commitlint

---

## 優先順位の考え方（3つの型）

### 型 A「家を建てる順番」

```
地盤（CI・ルール）を固める
  → 柱（コアゲームロジック）を立てる
    → 内装（UX・AI）を仕上げる
      → 増築（マルチプレイヤー・リリース自動化）する
```

地盤なしで内装を作ると、後で基礎工事のたびに内装を壊すことになる。

### 型 B「依存グラフ」

依存されている「根」から実装する。依存している「葉」は後回し。

```
#1 ゲームオーバー検出 ──→ #5 結果画面
                      ──→ #10 ゲームオーバーテスト（TDD: 同時）

#3 ハイライトロジック ──→ #6 ホバープレビュー
                      ──→ #69 ヒント機能

#21 ランダム AI ──→ #22 Greedy ──→ #19 Minimax ──→ #71 Alpha-Beta
                                                  ──→ #72 MCTS
                                                  ──→ #73 完全読み

#30 オンライン対戦 ──→ #31 部屋作成 ──→ #32 観戦 ──→ #103 QR招待

#26 棋譜保存 ──→ #27 再生モード ──→ #116 IndexedDB
#28 待った ──→ #98 局面からやり直し

#56 E2E (Playwright) ──→ #57 Visual Regression ──→ #82 コンポーネントテスト

#86 Branch protection ──→ #88 Required status checks
#83 semantic-release ──→ #84 Changelog ──→ #85 GitHub Release
```

### 型 C「後から入れるコスト」

commitlint・カバレッジ閾値・ESLint strict は後から入れると既存コードが全部引っかかる。
CI が安定している**今**入れるのが最安値。

---

## Tier 別着手順

### 🏗 Tier 0 — 地盤（GitHub Settings + コード規約の強制）

> 優先理由：全 PR に影響するルールを最初に設定しないと、後で「今まで入ったコードが全部違反」になる。
> CI 自体は既存。不足しているのは GitHub 側の設定と commitlint のみ。

| # | タイトル | 備考 |
|---|---------|------|
| #86 | Branch protection rules | GitHub Settings で main への直プッシュを禁止 |
| #88 | Required status checks | `lint-check` / `test-build` を必須にする（#86 と同時） |
| #87 | CODEOWNERS | `.github/CODEOWNERS` を作るだけ |
| #13 | PR テンプレート | `.github/pull_request_template.md` |
| #14 | issue テンプレート | `.github/ISSUE_TEMPLATE/` ディレクトリ |
| #62 | commitlint | `@commitlint/config-conventional` + `simple-git-hooks` の `commit-msg` フックに追加 |
| #12 | /ci-debug コマンド | CI 失敗時の対処手順を `CONTRIBUTING.md` に定型化 |

**順序**: #86+#88（セット、GitHub Web UI）→ #87 → #13 → #14 → #62 → #12

---

### 🧪 Tier 1 — 安全網（テスト補強）

> 優先理由：Tier 2 でコアロジックを変更する直前にテストを書く。
> `tests/unit/reversi.spec.ts` は基本ケースのみ。`shouldPass()` と `search()` のエッジケースが未テスト。
> TypeScript strict は tsconfig.json で既に有効。#63 は ESLint の TypeScript strict ルール追加を指す。

| # | タイトル | 備考 |
|---|---------|------|
| #7 | `shouldPass()` のテスト | 両者置けない→ゲームオーバーのケースを含む |
| #8 | `search()` のテスト | 8方向探索・反転なしケース |
| #9 | 境界エッジケーステスト | 端・角・盤面満杯 |
| #63 | `@typescript-eslint` strict ルール追加 | `.eslintrc.js` に `plugin:@typescript-eslint/strict` 追加 |
| #64 | `import/no-cycle` | `eslint-plugin-import` を追加して循環依存を検出 |
| #11 | カバレッジ閾値を CI で強制 | #7〜#9 が揃ったら `vite.config.ts` の `coverage.thresholds` に追加 |

**順序**: #7 → #8 → #9 → #63 → #64 → #11

---

### 🎮 Tier 2 — コアゲームを完成させる

> 優先理由：動くゲームがなければ UX 改善も AI も「壊れたゲームの飾り」になる。
> 現在 `shouldPass()` は「次のプレイヤーが置けない場合」にパスするが、双方置けない = ゲーム終了の検出が未実装。

具体的な不足箇所：
- `src/models/reversi.ts` — `Board.isGameOver()` が存在しない、`Board.put()` にゲームオーバー判定なし
- `src/stores/game.ts` — `isGameOver` / `winner` のような computed が存在しない
- `src/components/reversi/VGame.vue` — リセットボタン・結果表示なし

| # | タイトル | 依存 |
|---|---------|------|
| #1 | ゲームオーバー検出 | `Board.isGameOver()` 追加 |
| #10 | ゲームオーバーのテスト | #1 と同時（TDD） |
| #2 | リセットボタン | store に `reset()` 追加 |
| #4 | パス通知 | store に `isPassing` state 追加 |
| #5 | ゲーム結果画面 | #1 必要 |
| #3 | 置ける場所のハイライト | `Board.validMoves()` 追加 |

**順序**: #1（+#10）→ #2 → #4 → #5 → #3

---

### 🏠 Tier 3 — インフラ整備（デプロイ・観測可能性）

> GitHub Pages が入ると「URL を送れば動作確認できる」状態になり、UX レビューが格段に楽になる。

| # | タイトル |
|---|---------|
| #51 | GitHub Pages 自動デプロイ |
| #56 | E2E テスト（Playwright） |
| #57 | Visual Regression Testing（#56 の後） |
| #58 | knip（未使用コード検出） |
| #59 | madge（循環依存の構造可視化） |

**順序**: #51 → #56 → #57 → #58 → #59

---

### ✨ Tier 4 — UX・アクセシビリティ

> AI より基本的な使いやすさが先。#3 ハイライト（Tier 2）が完成していることが前提。

| # | タイトル | 備考 |
|---|---------|------|
| #18 | レスポンシブ対応 | — |
| #16 | キーボードナビゲーション | — |
| #17 | アニメーション | — |
| #6 | ホバープレビュー | #3 のロジックを再利用 |
| #33 | ダークモード | — |
| #41〜#45 | アクセシビリティ（5件） | まとめて対応 |

---

### 🤖 Tier 5 — AI（弱い順に実装）

**絶対に弱い順で実装する**。強い AI は弱い AI の拡張として作る。

```
#21 ランダム AI
  → #22 Greedy AI
    → #19 Minimax（深さ制限あり）
      → #74 評価関数チューニング
      → #75 思考時間制限
      → #71 Alpha-Beta pruning
        → #76 AI vs AI
        → #72 MCTS
        → #73 完全読み
→ #102 手の評価コメント（#19 以降）
```

---

### 📊 Tier 6 — 統計・ゲームバリエーション

Tier 2 完成後に追加できる独立した機能群。

| グループ | # |
|---------|---|
| 統計・実績 | #20, #46〜#50 |
| 棋譜・履歴 | #26→#27→#116→#28→#98（この順） |
| ゲームバリエーション | #23, #24, #25 |
| 学習支援 | #39, #40, #69, #70 |

---

### 🌐 Tier 7 — マルチプレイヤー

サーバーサイド実装が必要な最も複雑な機能群。他の機能が揃ってから着手。

```
#29 ローカル2人対戦（サーバー不要）→ #30 オンライン対戦
  → #31 部屋作成・招待リンク → #32 観戦 → #103 QR招待
```

---

### 🚀 Tier 8 — リリース自動化・高度な DX

コードが安定してから入れる。早期に入れると設定変更のたびにリリースが走る。

- `#83 semantic-release → #84 Changelog → #85 GitHub Release`
- `#89 Merge queue`
- `#90〜#92 Dev Container / Codespaces / Volta`
- `#93〜#95 VueUse / @vueuse/motion / Floating UI`

---

### 📄 Tier 9 — ドキュメント・セキュリティ・モニタリング

OSS公開・チーム拡大・本番運用開始のタイミングで。

- `#104〜#108` ドキュメント
- `#65〜#68, #118〜#120` セキュリティ
- `#109〜#113` モニタリング
- `#114〜#117` パフォーマンス

---

## 3原則（まとめ）

1. **仕組みは機能より先** — テスト・lint・Branch protection が品質の盾。盾なしで機能を作ると作った端から品質が崩れる
2. **依存している側は後回し** — 依存グラフを書いて「根」から着手する
3. **弱いものから強いものへ** — AI はランダム→Greedy→Minimax の順、テストはユニット→E2E の順。「動く最小版」を先に

---

## 次の一手

```
今すぐやること（Tier 0 の最初の2件）:
  → #86: GitHub Settings → Branches → "Add branch protection rule" for `main`
  → #88: 同じ画面で "Require status checks to pass" → lint-check / test-build を選択
  ※ CI ワークフロー自体は既存（.github/workflows/）。設定は GitHub Web UI で完結する
```
