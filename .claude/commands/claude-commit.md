---
description: 直近コミットに Claude を co-author として追加する
disable-model-invocation: true
allowed-tools: Bash(git commit:*)
---

直近のコミットに Claude を Co-Authored-By トレーラーとして追加する。
コミットメッセージ本文は変更しない。

```bash
git commit --amend --no-edit --trailer "Co-Authored-By: Claude <noreply@anthropic.com>"
```

> **注意:** push 前にのみ実行すること。push 済みのコミットに対して実行すると履歴が
> 書き換わり、force push が必要になる。
