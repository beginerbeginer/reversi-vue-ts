---
name: git-secret-guard
description: >
  コミット・プッシュ前に機密情報が含まれていないかをチェックするフロー。
  API キー・シークレット・.env ファイル・秘密鍵の検出パターンと
  誤ってコミットした場合の対処法を含む。
when_to_use: >
  コミットする前、PR を作成する前、新しいファイルを追加するとき、
  .env ファイルに触れたとき、認証情報を扱うコードを書いたときに参照する。
---

# git にセキュアな情報を上げない

コミット・プッシュ前に、機密情報がステージに含まれていないかを確認する。

## チェックリスト（コミット前に必ず実行）

### 1. ステージ内容を確認する

```bash
git diff --staged
```

以下のパターンが含まれていないか目視確認する。

### 2. 機密情報の種類と検出パターン

| 種類 | 検出キーワード例 |
|------|--------------|
| API キー | `sk-`, `pk_`, `OPENAI_API_KEY`, `API_KEY=`, `api_key` |
| シークレット | `SECRET`, `PASSWORD`, `PASSWD`, `TOKEN=`, `ACCESS_TOKEN` |
| 秘密鍵 | `-----BEGIN RSA PRIVATE KEY-----`, `-----BEGIN EC PRIVATE KEY-----` |
| AWS 認証情報 | `aws_access_key_id`, `aws_secret_access_key`, `AKIA` |
| DB 接続文字列 | `mysql://`, `postgresql://`, `mongodb+srv://` |
| .env ファイル | `.env`, `.env.local`, `.env.production` |
| 証明書・鍵ファイル | `*.pem`, `*.key`, `*.p12`, `*.pfx` |

### 3. 危険なファイルが含まれていないか確認

```bash
git diff --staged --name-only
```

以下のファイルがステージに入っていないかチェック：
- `.env` / `.env.*`
- `*.pem` / `*.key` / `*.p12`
- `credentials.json` / `service_account.json`
- `config/secrets.yml` / `config/database.yml`（平文パスワードが入っている場合）

### 4. .gitignore を確認・補強する

機密ファイルが .gitignore に含まれているか確認：

```bash
cat .gitignore | grep -E "\.env|\.pem|\.key|secret|credential"
```

含まれていなければ追加する：

```
# Secrets
.env
.env.*
*.pem
*.key
*.p12
*.pfx
credentials.json
service_account.json
```

---

## 万が一コミットしてしまった場合

**`git push` しない**。push した瞬間に履歴に残り、シークレットのローテーションが確実に必要になるため。その後：

1. `git reset HEAD~1`（直前のコミットを取り消す）
2. 機密情報をローカルから削除または .gitignore に追加
3. シークレットをローテーション（キーを無効化して新規発行）
4. 再コミット

> プッシュ済みの場合でも、シークレットはローテーションする。
> git の履歴から完全削除するには `git filter-repo` を使う（履歴書き換えになるため慎重に）。

---

## このセッションでのルール

- ステージに機密情報が見つかった場合はコミットを中断して報告する
- `.env` ファイルはコミットしない。一度でも push されると git 履歴に残り、シークレットのローテーションが必要になるため
- シークレットをハードコードしない——環境変数か外部シークレット管理（Dashlane / AWS Secrets Manager 等）を使う
