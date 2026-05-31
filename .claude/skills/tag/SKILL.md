---
name: tag
description: >
  release-please による git tag・GitHub Release の運用フロー。
  Release PR の確認方法、マージ判断基準、SemVer の意味を含む。
when_to_use: >
  リリースしたい、タグを打ちたい、バージョンを上げたい、
  Release PR をどうすべきか迷っているときに参照する。
---

# リリース（git tag）の手順

このプロジェクトは release-please で git tag を自動管理している。
人間がやることは「Release PR の内容を確認し、問題があれば auto-merge を無効化する」だけ。

---

## 現在のリリース状況を確認する

```bash
# 最新タグを確認
git tag --sort=-version:refname | head -5

# 前回タグから今までの変更を確認
gh pr list --base main --state merged --limit 20
```

## Release PR の状況を確認する

```bash
# release-please が作成した PR を探す
gh pr list --author "github-actions[bot]" --label "autorelease: pending"
```

## リリースの判断基準

release-please は PR を自動生成し、CI 通過後に**自動でマージされる**（release.yml で設定済み）。
人間がやることは「Release PR の内容を確認し、問題があれば auto-merge を無効化する」だけ。

| 状況 | 判断 |
|---|---|
| feat が含まれる | 新機能がユーザーに届く。CHANGELOG を確認して問題なければ自動マージに任せる |
| fix だけ | バグ修正のみ。緊急度が高くなければ次の feat と合わせることも検討できる（その場合 auto-merge を無効化） |
| chore / docs / test だけ | バージョンは変わらないので Release PR は作られない |

## リリースする

Release PR が CI を通過すると自動でマージされ、以下が実行されます：

1. `package.json` の version が更新される
2. `CHANGELOG.md` が生成・更新される
3. git tag（例: `v0.2.0`）が作成される
4. GitHub Release が公開される

auto-merge を無効化して手動マージしたい場合：

```bash
# Release PR 番号を確認
gh pr list --author "github-actions[bot]"

# auto-merge を無効化してから手動マージ
gh pr merge <PR番号> --disable-auto --merge
```

---

## バージョン番号の意味（SemVer）

```
v MAJOR . MINOR . PATCH
  ↑        ↑       ↑
  互換性    新機能   バグ修正
  を壊す    追加     のみ
```

Conventional Commits との対応：

| コミットタイプ | バージョン変化 |
|---|---|
| `fix:` | PATCH +1（例: v0.1.0 → v0.1.1） |
| `feat:` | MINOR +1（例: v0.1.0 → v0.2.0） |
| `feat!:` / `BREAKING CHANGE` | MAJOR +1（例: v0.1.0 → v1.0.0） |
| `chore:` / `docs:` / `test:` | 変化なし |
