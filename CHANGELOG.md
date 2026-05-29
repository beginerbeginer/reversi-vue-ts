# Changelog

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
