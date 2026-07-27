# Git ワークフロー規約

このリポジトリの Git 運用規約は本ファイルで完結する。上位ディレクトリの `CLAUDE.md`
（`~/CLAUDE.md` など）には依存しない。他リポジトリの規約と食い違った場合は本ファイルを優先すること。

## 作業の開始（issue 先行）

- ファイルを変更する前に issue を作成すること。変更の意図が Git 履歴と紐づき、
  後から「なぜこの変更をしたか」を辿れるようになるため
- issue 番号が確定してからブランチを切ること

## ブランチ

- 命名規則: `<type>/<issue番号>-<説明>` — 説明は kebab-case で書くこと
- `<type>` はコミットメッセージと同じ語彙を使うこと。ブランチ名だけ別語彙にすると、
  ブランチとコミットの対応が読み取れなくなる
- 例: `fix/365-alpha-beta-pruning`
- `main` への直接 push は禁止。PR → CI 通過 → マージの順で進めること
- pre-push フックで Playwright E2E テストが自動実行される

## コミットメッセージ

- Conventional Commits 形式で書くこと: `<type>(<scope>): <subject>`
- type: `feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore`
- `commit-msg` フックで自動チェックされる
- 本文には Why（なぜこの変更が必要か）を日本語で書くこと。How はコードを見ればわかるため書かない

例: `fix(board): shouldPass が両者パス時にゲームを終了しない問題を修正する`

## gh コマンドのエイリアス

`.claude/skills/` 配下の各スキルはこのエイリアスを前提に手順を書いている。

| エイリアス | 実際のコマンド |
|-----------|--------------|
| `gh il` | `gh issue list` |
| `gh ic` | `gh issue create` |
| `gh co` | `gh pr checkout` |
| `gh pc` | `gh pr create --base main` |
| `gh pm N` | `gh pr merge N --merge --delete-branch` |
| `gh mypr` | `gh pr list -s all -a beginerbeginer` |

エイリアスの実体は `~/.config/gh/config.yml`（chezmoi 管理）にある。未定義の環境では
展開後のコマンドを直接使うこと。

## コードコメント

- **Why not** スタイルで書くこと: Why（なぜその選択か）を記述し、How/What は書かない
- 良い例: `// nextTick を使う。DOM 更新前に querySelector すると null になるため`
- 悪い例: `// DOM 更新後に querySelector を実行する`（How を説明しているだけ）
