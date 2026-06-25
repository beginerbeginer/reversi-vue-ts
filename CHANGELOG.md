# Changelog

## [1.13.1](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.13.0...v1.13.1) (2026-06-25)


### Bug Fixes

* **board:** 狭幅画面（iPhone SE 3rd）で盤面がはみ出さないようレスポンシブ化する ([e128c6d](https://github.com/beginerbeginer/reversi-vue-ts/commit/e128c6da55d3a6fea2f21530691c9893827bdc3f))
* **board:** 狭幅画面で盤面がはみ出さないようレスポンシブ化する ([45e4b37](https://github.com/beginerbeginer/reversi-vue-ts/commit/45e4b37081726fe533a6fe120264e91c59e3a54f))
* **board:** 石の余白の下限を border 幅に揃えて狭幅時の枠被りを防ぐ ([d9b8c9f](https://github.com/beginerbeginer/reversi-vue-ts/commit/d9b8c9f5a62890861d62fed4aaaa974f6234aa7d))

## [1.13.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.12.2...v1.13.0) (2026-06-25)


### Features

* **cpu:** ミニマックス法（depth=2, α-β枝刈り）で上級 CPU を実装する ([e5a2763](https://github.com/beginerbeginer/reversi-vue-ts/commit/e5a2763e61f73255abd241d50f0e57f72bbe0be3))
* **cpu:** ミニマックス法（depth=2, α-β枝刈り）で上級 CPU を実装する ([#285](https://github.com/beginerbeginer/reversi-vue-ts/issues/285)) ([3811812](https://github.com/beginerbeginer/reversi-vue-ts/commit/3811812c45ffe1a2eb28f9548dfe824f0e1450a7))

## [1.12.2](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.12.1...v1.12.2) (2026-06-10)


### Bug Fixes

* **cpu:** playGame が合法手があるのに null をパスとして扱う問題を修正する ([46d5f93](https://github.com/beginerbeginer/reversi-vue-ts/commit/46d5f931d513c7bb8eaa64c7ff7356dec87a1b55))
* **cpu:** playGame が合法手チェックなしに null をパスとして扱う問題を修正する ([2310243](https://github.com/beginerbeginer/reversi-vue-ts/commit/23102432e04529abbd973c132413d0e94679b0c7))

## [1.12.1](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.12.0...v1.12.1) (2026-06-10)


### Bug Fixes

* **test:** cpu 強さ評価テストの Codex 指摘②③④を対応する ([8b6e4a7](https://github.com/beginerbeginer/reversi-vue-ts/commit/8b6e4a7b6f2263bdf4dcd75a45d728cca3c0303f))
* **test:** seeded PRNG で strength テストを決定論的にする ([ed9c427](https://github.com/beginerbeginer/reversi-vue-ts/commit/ed9c427d52c25b67b467deb647603c7342cc9cdf))

## [1.12.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.11.1...v1.12.0) (2026-06-10)


### Features

* **cpu:** 中級cpu を実装する（貪欲法・最大反転手選択）([#284](https://github.com/beginerbeginer/reversi-vue-ts/issues/284)) ([0388519](https://github.com/beginerbeginer/reversi-vue-ts/commit/03885198fed304af8bfe322b4e202f792bec13fa))
* **cpu:** 中級cpu を実装する（貪欲法・最大反転手選択）([#284](https://github.com/beginerbeginer/reversi-vue-ts/issues/284)) ([1fcfb24](https://github.com/beginerbeginer/reversi-vue-ts/commit/1fcfb24e126345887ae46e091f08392b714400f3))


### Bug Fixes

* **cpu:** 同点候補からランダム選択・テスト強化 ([6502d7d](https://github.com/beginerbeginer/reversi-vue-ts/commit/6502d7de94ce479faa36bf474b2079e650e03ec8))
* **lint:** 意図的未使用引数の警告を解消する ([1938082](https://github.com/beginerbeginer/reversi-vue-ts/commit/19380828fe317546428dfb39a4ebb39dd5e9af3d))

## [1.11.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.10.0...v1.11.0) (2026-06-10)


### Features

* **cpu:** cpu着手に0.5秒の待機を設け、将来のレベル追加に対応した設計にする ([3cf360c](https://github.com/beginerbeginer/reversi-vue-ts/commit/3cf360c6670ecd02b4d80142b5beb9b2c90c8876))
* **cpu:** 初級cpu を実装する（ランダム手選択・自動着手） ([3847b37](https://github.com/beginerbeginer/reversi-vue-ts/commit/3847b37ab3f5c6d0619f7316a504f7166a1f7cea))
* **cpu:** 初級cpu を実装する（ランダム手選択・自動着手）([#283](https://github.com/beginerbeginer/reversi-vue-ts/issues/283)) ([c1a78a6](https://github.com/beginerbeginer/reversi-vue-ts/commit/c1a78a689a762a84155748e5f5da04734463cc85))


### Bug Fixes

* **cpu:** cpu のターン中に人間の操作が通ってしまう問題を修正する ([46edb7b](https://github.com/beginerbeginer/reversi-vue-ts/commit/46edb7b723c4f32a699b552c3c6d5d76b9ae1c11))
* **cpu:** cpu モードの3つのバグを修正する ([#292](https://github.com/beginerbeginer/reversi-vue-ts/issues/292)) ([3a2930b](https://github.com/beginerbeginer/reversi-vue-ts/commit/3a2930b119fd3c4e3ef81c844ba2385a865a4cbe))
* **ui:** cpu のターン中に「置けます」が表示されてしまう問題を修正する ([cd9f93d](https://github.com/beginerbeginer/reversi-vue-ts/commit/cd9f93da04852eb52536d4af3483765c6804d117))
* **ui:** cpu モードで待った機能を選択できないようにする ([#302](https://github.com/beginerbeginer/reversi-vue-ts/issues/302)) ([8917138](https://github.com/beginerbeginer/reversi-vue-ts/commit/8917138c6b4eefffc1222265cf29dc4e212dbc25))

## [1.10.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.9.0...v1.10.0) (2026-06-08)


### Features

* **ui:** cpu対戦時に先手/後手を選択できる UI を追加する ([5cefd4f](https://github.com/beginerbeginer/reversi-vue-ts/commit/5cefd4fb28889c88ce08d4b63b95455b11da2b77))
* **ui:** cpu対戦時に先手/後手を選択できる UI を追加する ([#288](https://github.com/beginerbeginer/reversi-vue-ts/issues/288)) ([32d96eb](https://github.com/beginerbeginer/reversi-vue-ts/commit/32d96eba78bc5dfdee8b30d655b1abdb0ba5a036))

## [1.9.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.8.2...v1.9.0) (2026-06-08)


### Features

* **ui:** スタート画面にノーマル/CPUモード選択UIを追加する ([f3b0714](https://github.com/beginerbeginer/reversi-vue-ts/commit/f3b0714d75e217d5f74de414daa8f422ec48fb80))
* **ui:** スタート画面にノーマル/CPUモード選択UIを追加する ([e0be7aa](https://github.com/beginerbeginer/reversi-vue-ts/commit/e0be7aa6c1956f6bae5cf6204f3a6619fe43130f)), closes [#279](https://github.com/beginerbeginer/reversi-vue-ts/issues/279)


### Bug Fixes

* **test:** gameMode 追加後の startGame 呼び出し引数アサーションを修正する ([e0362ed](https://github.com/beginerbeginer/reversi-vue-ts/commit/e0362ed5177d46fcf94267f4ce3297ed4c07d295))
* **ui:** モード選択トグルの選択状態が見た目で判断できない問題を修正する ([5c2a825](https://github.com/beginerbeginer/reversi-vue-ts/commit/5c2a8257e5c45d9a1db4aa246c8849697c7081a0))

## [1.8.2](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.8.1...v1.8.2) (2026-06-06)


### Bug Fixes

* **test:** 「挟めない」テストのボードセットアップを正しい座標に修正する ([f196d4e](https://github.com/beginerbeginer/reversi-vue-ts/commit/f196d4eaff3c029e2aecf940183ac5a21c93b7be))
* **test:** 「挟めない」テストのボードセットアップを正しい座標に修正する ([2c377bd](https://github.com/beginerbeginer/reversi-vue-ts/commit/2c377bd1bb9ada51c9e17ea30baef2384e08e827)), closes [#276](https://github.com/beginerbeginer/reversi-vue-ts/issues/276)

## [1.8.1](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.8.0...v1.8.1) (2026-06-06)


### Bug Fixes

* **test:** router 統合テストで本番ルートレコードを使う ([392b02c](https://github.com/beginerbeginer/reversi-vue-ts/commit/392b02c2e99a1c4812922e268a57c25e43108163))
* **test:** router 統合テストで本番ルートレコードを使う ([f5fa296](https://github.com/beginerbeginer/reversi-vue-ts/commit/f5fa296be6b0f64ca2fd74220e45e3502514d8b4)), closes [#271](https://github.com/beginerbeginer/reversi-vue-ts/issues/271)
* **test:** 黒石スナップショットを実際に占有済みのセルで撮り直す ([0663088](https://github.com/beginerbeginer/reversi-vue-ts/commit/06630883322be9b8a7f22f09f6fa1768e5d47201))
* **test:** 黒石スナップショットを実際に占有済みのセルで撮り直す ([087023c](https://github.com/beginerbeginer/reversi-vue-ts/commit/087023c9c6f58039b10266c1a161106767846cc3)), closes [#270](https://github.com/beginerbeginer/reversi-vue-ts/issues/270)

## [1.8.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.7.1...v1.8.0) (2026-06-02)


### Features

* **settings:** 設定ページとホバープレビュー機能を追加する ([9629aed](https://github.com/beginerbeginer/reversi-vue-ts/commit/9629aedd2bd56c9cd48cb44018b5570e774eb577))
* **settings:** 設定ページとホバープレビュー機能を追加する ([f283daf](https://github.com/beginerbeginer/reversi-vue-ts/commit/f283daf2744124aa4916ccb89426352720f2b017))

## [1.7.1](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.7.0...v1.7.1) (2026-06-02)


### Performance Improvements

* **store:** isGameOver で validMoves の computed 結果を再利用する ([b6a31de](https://github.com/beginerbeginer/reversi-vue-ts/commit/b6a31de2f676f0ee5acdcae974ea0bc6d8beb5a7))
* **store:** isGameOver で validMoves の computed 結果を再利用する ([8fcc547](https://github.com/beginerbeginer/reversi-vue-ts/commit/8fcc5472a9d2190f8168bc06cad7ff0affc23641))

## [1.7.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.6.0...v1.7.0) (2026-06-01)


### Features

* **a11y:** @axe-core/playwright で WCAG 自動検知を E2E に追加する ([e4bc9cf](https://github.com/beginerbeginer/reversi-vue-ts/commit/e4bc9cf7f2df5364f35e834cf254a155d6042909))
* **a11y:** @axe-core/playwright で WCAG 自動検知を E2E に追加する ([bef471c](https://github.com/beginerbeginer/reversi-vue-ts/commit/bef471c664b6e4ad751c2094c8a2043c787d22c7))
* **ci:** a11y コメントに円グラフとランクバッジを追加する ([4b19ebd](https://github.com/beginerbeginer/reversi-vue-ts/commit/4b19ebd7eafaa1a65f13cae210f8adb3dba81e2c))
* **ci:** axe a11y テストを CI で自動実行して PR にコメントする ([6a19d1e](https://github.com/beginerbeginer/reversi-vue-ts/commit/6a19d1ea067ba5dc3c8d537857a12ee28af3da61))

## [1.6.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.5.0...v1.6.0) (2026-06-01)


### Features

* **lint:** eslint-plugin-vuejs-accessibility を追加して a11y 違反を自動検知する ([aa17146](https://github.com/beginerbeginer/reversi-vue-ts/commit/aa17146b450d85fed501a12153a32ecc1fe2fc91))
* **lint:** eslint-plugin-vuejs-accessibility を追加して a11y 違反を自動検知する ([818d9e3](https://github.com/beginerbeginer/reversi-vue-ts/commit/818d9e3fbaf4ffd7953ea2b760000759e543dca7))

## [1.5.0](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.4.3...v1.5.0) (2026-06-01)


### Features

* **a11y:** ゲーム盤のアクセシビリティ対応を追加する ([8a45fe9](https://github.com/beginerbeginer/reversi-vue-ts/commit/8a45fe986335f83e7bf6d434852f39726162ad03))
* **a11y:** ゲーム盤のアクセシビリティ対応を追加する ([c7cd693](https://github.com/beginerbeginer/reversi-vue-ts/commit/c7cd693236219eeca978fc5f262b013c4db0924b))


### Bug Fixes

* **a11y:** aria-disabled を削除して E2E の click 可否チェックを回避する ([61dab23](https://github.com/beginerbeginer/reversi-vue-ts/commit/61dab23299c25f2a4f69620869b2ad244ee36143))
* **a11y:** 有効な手のマスだけ button / tabindex=0 にする ([9905245](https://github.com/beginerbeginer/reversi-vue-ts/commit/9905245217dfa89ab76e37414d7737003e432e8e))

## [1.4.3](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.4.2...v1.4.3) (2026-05-31)


### Bug Fixes

* **settings:** enabledPlugins をプロジェクト設定から削除する ([27da6b1](https://github.com/beginerbeginer/reversi-vue-ts/commit/27da6b10d4a7f864a262bf3de5ddd34e422bc7dc))
* **skills:** git-secret-guard から disable-model-invocation を削除する ([02b51fc](https://github.com/beginerbeginer/reversi-vue-ts/commit/02b51fc306368a75ae7c571559ebe73e255caafd))
* **skills:** tag スキルの gh pr merge コマンドを2段階に分割する ([1c2d9db](https://github.com/beginerbeginer/reversi-vue-ts/commit/1c2d9db18f57790e4169d1913956f117d0babc3e))

## [1.4.2](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.4.1...v1.4.2) (2026-05-31)


### Bug Fixes

* **ci-debug:** knip と test:integration を CI 確認手順に追加する ([3c57d9f](https://github.com/beginerbeginer/reversi-vue-ts/commit/3c57d9f5b3a6090d9c336e85308e322fa1850e34))

## [1.4.1](https://github.com/beginerbeginer/reversi-vue-ts/compare/v1.4.0...v1.4.1) (2026-05-31)


### Bug Fixes

* ゲームオーバー時にパス通知が表示されないようにする ([11e035b](https://github.com/beginerbeginer/reversi-vue-ts/commit/11e035ba79e5586a433c813f488fdf567ab1df7a))
* ゲームオーバー時にパス通知が表示されないようにする ([93e52f2](https://github.com/beginerbeginer/reversi-vue-ts/commit/93e52f2d83ae8e2ec25d816bbfae87c0c6acd4f4)), closes [#211](https://github.com/beginerbeginer/reversi-vue-ts/issues/211)
* ゲームオーバー時にパス通知を抑制する ([841ab46](https://github.com/beginerbeginer/reversi-vue-ts/commit/841ab460ef2deca3b3bb780e5805df4759afb636)), closes [#212](https://github.com/beginerbeginer/reversi-vue-ts/issues/212)

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
