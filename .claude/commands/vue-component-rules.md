# Vue コンポーネント設計ルール

このプロジェクトで守るべき Vue コンポーネントの設計原則。

## データフローの鉄則

```
親 → 子: Props のみ（表示データを渡す）
子 → 親: データを渡すことは禁止
```

**禁止パターン:**
```
VCell --emit--> VRow --emit--> VBoard --emit--> VGame
（データが子から親へ連鎖する）
```

**許可パターン:**
```
VGame --props--> VBoard --props--> VRow --props--> VCell
VCell --action--> Pinia Store
（子はストアのアクションを直接呼ぶ）
```

## ライフサイクルの意識

| フェーズ | やること |
|---------|---------|
| `onMounted` | DOM が必要な初期化（スクロール位置取得など） |
| `onUnmounted` | タイマーやイベントリスナーのクリーンアップ |
| `setup` / トップレベル | リアクティブな状態・算出プロパティの定義 |

- 副作用（API 呼び出し、タイマーなど）は必ず `onMounted` 以降で行う
- `setup` 時点では DOM が存在しないことを常に意識する

## コンポーネントの責務分担

| コンポーネント | 責務 |
|-------------|------|
| ページコンポーネント（VGame など） | ストアの状態を読んで表示コンポーネントに渡す |
| 表示コンポーネント（VBoard / VRow） | Props で受け取ったデータをレンダリングするだけ |
| インタラクションコンポーネント（VCell） | ユーザー操作を受け取り、ストアのアクションを直接呼ぶ |

## ストア（Pinia）の使い方

```typescript
// ✅ 子コンポーネントがストアのアクションを直接呼ぶ
const store = useGameStore();
function onClick() { store.put(x, y); }

// ❌ emit で親にデータを渡してから親が処理する
const emit = defineEmits<{ put: [p: Point] }>();
function onClick() { emit("put", new Point(x, y)); }
```

## Props は読み取り専用

- 受け取った Props を直接変更しない
- 変更が必要ならストアのアクションを呼ぶ
