# Changelog

## [1.4.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.3.0...v1.4.0) (2026-05-31)


### Features

* ゲーム開始前のモード選択で待った機能を有効化できるようにする ([ea4d9b8](https://github.com/beginerbeginer/reversi-vue-ts/commit/ea4d9b8657534b7ea085d626812cef35217bf654))
* ゲーム開始前のモード選択で待った機能を有効化できるようにする ([3a0cd9a](https://github.com/beginerbeginer/reversi-vue-ts/commit/3a0cd9a4b7bacd74a3cc9edffb388462ba065305))


### Bug Fixes

* 無効な手でも履歴に追加されていたバグを修正 ([e90eecb](https://github.com/beginerbeginer/reversi-vue-ts/commit/e90eecb841be57039f86851963305bf6f160e0d8))

## [1.3.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.2.3...v1.3.0) (2026-05-30)


### Features

* 勝利時に紙吹雪エフェクトを表示する ([b57fb97](https://github.com/beginerbeginer/reversi-vue-ts/commit/b57fb97709f6f9aa2fbf1036f1ee8b6d823111f9))
* 勝利時に紙吹雪エフェクトを表示する ([3623124](https://github.com/beginerbeginer/reversi-vue-ts/commit/36231248a7418935fb06433397e909f04c75f4f3)), closes [#125](https://github.com/beginerbeginer/reversi-vue-ts/issues/125)


### Bug Fixes

* integration テストで canvas-confetti をモックする ([7e35e94](https://github.com/beginerbeginer/reversi-vue-ts/commit/7e35e9426518b36856b4a5bff05a8c416d01656d))

## [1.2.3](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.2.2...v1.2.3) (2026-05-29)


### Bug Fixes

* CI スキップ条件に PR 作成者チェックを追加し skipped を通過扱いにする ([9e19cae](https://github.com/beginerbeginer/reversi-vue-ts/commit/9e19cae1dd78d3ce1fba3e64b242748f26badae8))
* release PR スキップ条件に head repo チェックを追加する ([dc3b275](https://github.com/beginerbeginer/reversi-vue-ts/commit/dc3b2754a7f38e079df8192fc12ad62671751a23))
* release PR で CI をスキップする ([d2579c0](https://github.com/beginerbeginer/reversi-vue-ts/commit/d2579c0426c8736fc3e4666403b4bafad8189c70))
* release PR で CI をスキップする ([2642845](https://github.com/beginerbeginer/reversi-vue-ts/commit/26428452c2c07ad7b080e5442f0a78481cfde234))


### Reverts

* release PR の CI スキップ条件を削除する ([66d781c](https://github.com/beginerbeginer/reversi-vue-ts/commit/66d781c0f4b1fb53cc12589d0cb68b62ba2b9117))
* release PR の CI スキップ条件を削除する ([059defb](https://github.com/beginerbeginer/reversi-vue-ts/commit/059defb45d2aab60d71544fba66d75ea29311d94))

## [1.2.2](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.2.1...v1.2.2) (2026-05-29)


### Bug Fixes

* auto-merge ステップの GH_TOKEN も RELEASE_TOKEN に統一する ([8800303](https://github.com/beginerbeginer/reversi-vue-ts/commit/8800303760ee006a1f2ee12d8a28478cf5ae3fb0))
* outputs.pr から PR 番号を正しく取り出す ([d2c7000](https://github.com/beginerbeginer/reversi-vue-ts/commit/d2c700082d5e2ecd453413c278f144bfd70c1a08))
* release auto-merge ステップに GH_REPO を追加する ([27ab15b](https://github.com/beginerbeginer/reversi-vue-ts/commit/27ab15b952db12072aa8ba16532270a77ad85423))
* release auto-merge ステップに GH_REPO を追加する ([7b51bce](https://github.com/beginerbeginer/reversi-vue-ts/commit/7b51bcef7e3f8b2648b19be97f984c423407aa71))
* release PR の auto-merge が機能しない問題を PAT で解決する ([f709330](https://github.com/beginerbeginer/reversi-vue-ts/commit/f70933008d7b0f89759ba79e44c6e421cf8a1096))
* release PR の auto-merge を正しい方法で実装する ([2fcaba9](https://github.com/beginerbeginer/reversi-vue-ts/commit/2fcaba92668e3fe9773c67bd5e0d14c65047c843))
* release-please の token を RELEASE_TOKEN（PAT）に切り替える ([683de3a](https://github.com/beginerbeginer/reversi-vue-ts/commit/683de3ae7ce91d406f3151f77989636d88ecda46))

## [1.2.1](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.2.0...v1.2.1) (2026-05-29)


### Bug Fixes

* localStorage のテーマ値を検証してから Vuetify に渡す ([f81dc85](https://github.com/beginerbeginer/reversi-vue-ts/commit/f81dc859772025b3a20b5cd543071d5ed6f23485))
* localStorage のテーマ値を検証してから Vuetify に渡す ([d3921dc](https://github.com/beginerbeginer/reversi-vue-ts/commit/d3921dcfae300dbd9f07d31622a0430e5c5c6608))

## [1.2.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.1.0...v1.2.0) (2026-05-28)


### Features

* ダークモード切り替え機能を実装する ([be6a755](https://github.com/beginerbeginer/reversi-vue-ts/commit/be6a75530cd0160015c7ac66c3046a7d84ff9869))
* ダークモード切り替え機能を実装する ([8b59299](https://github.com/beginerbeginer/reversi-vue-ts/commit/8b59299af17adbd3ddd1b1eb3c9fe51666c9d515)), closes [#167](https://github.com/beginerbeginer/reversi-vue-ts/issues/167)


### Bug Fixes

* use globalthis for resizeobserver mock ([39c6b12](https://github.com/beginerbeginer/reversi-vue-ts/commit/39c6b123118f1a3804d4953c3cf714ab15d56a52)), closes [#167](https://github.com/beginerbeginer/reversi-vue-ts/issues/167)

## [1.1.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.0.0...v1.1.0) (2026-05-28)


### Features

* **e2e:** Playwright セットアップと基本ゲームテスト追加 ([#80](https://github.com/beginerbeginer/reversi-vue-ts/issues/80)) ([e774b52](https://github.com/beginerbeginer/reversi-vue-ts/commit/e774b52b07cfa70af2fdf1b91dab96d2d5dde4fe))


### Bug Fixes

* **ci:** pre-push フックでブラウザインストールを事前に実行するよう修正する ([52813e7](https://github.com/beginerbeginer/reversi-vue-ts/commit/52813e760740458aaa172f1f5367b1d4013f170f))
* **ci:** pre-push フックのコマンドを npm run test:e2e に修正する ([d1abd4d](https://github.com/beginerbeginer/reversi-vue-ts/commit/d1abd4dff1c7f3d9207923725820465b1842b83e))
* **ci:** pre-push フックを node_modules の playwright バイナリを直接参照するよう修正する ([4093822](https://github.com/beginerbeginer/reversi-vue-ts/commit/40938229c33267636f510894025d3b29cd4e1ae1))
* **e2e:** vitest から E2E テストを除外し Hash モードのルートに対応 ([17ea741](https://github.com/beginerbeginer/reversi-vue-ts/commit/17ea7411e196feaec1846a22f8f45ebd6b791021))
