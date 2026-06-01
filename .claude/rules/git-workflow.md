# Git ワークフロー規約

## コミットメッセージ

- Conventional Commits 形式で書くこと: `<type>(<scope>): <subject>`
- type: `feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore`
- `commit-msg` フックで自動チェックされる

例: `fix(board): shouldPass が両者パス時にゲームを終了しない問題を修正する`

## ブランチ・PR

- `main` への直接 push は禁止。PR → CI 通過 → マージの順で進めること
- pre-push フックで Playwright E2E テストが自動実行される

## コードコメント

- **Why not** スタイルで書くこと: Why（なぜその選択か）を記述し、How/What は書かない
- 良い例: `// nextTick を使う。DOM 更新前に querySelector すると null になるため`
- 悪い例: `// DOM 更新後に querySelector を実行する`（How を説明しているだけ）
