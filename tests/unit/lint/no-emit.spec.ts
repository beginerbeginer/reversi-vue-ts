import { describe, expect, it } from "vitest";
import { ESLint } from "eslint";

// eslint.config.mjs をそのまま読み込んで検証する。セレクタをテストへ直書きすると
// 設定と乖離しても気づけず、「設定を書いたから効いているはず」に逆戻りするため（#400）
const eslint = new ESLint();

// src/**/*.vue スコープの設定を当てるため、実在しないパスでも src/components 配下にする
const PROBE_PATH = "src/components/__emit_probe.vue";

async function lintErrors(code: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath: PROBE_PATH });
  return result.messages
    .filter((message) => message.severity === 2)
    .map((message) => message.ruleId ?? "unknown");
}

const EMIT_TEMPLATE = `<template><button @click="$emit('put')">x</button></template>`;

const DECLARATION_ROUTES = [
  [
    "<script setup> の defineEmits",
    `<script setup lang="ts">const emit = defineEmits<{ put: [n: number] }>();</script>`,
  ],
  [
    "defineModel（update:modelValue を暗黙に emit する）",
    `<script setup lang="ts">const model = defineModel<number>();</script>`,
  ],
  [
    "Options API の emits オプション",
    `${EMIT_TEMPLATE}<script lang="ts">export default { emits: ["put"] };</script>`,
  ],
  [
    "クォートキーの emits オプション",
    `${EMIT_TEMPLATE}<script lang="ts">export default { "emits": ["put"] };</script>`,
  ],
  [
    "計算キーの emits オプション",
    `${EMIT_TEMPLATE}<script lang="ts">export default { ["emits"]: ["put"] };</script>`,
  ],
  [
    "defineOptions の emits オプション",
    `<script setup lang="ts">defineOptions({ emits: ["put"] });</script>`,
  ],
  [
    "setup(props, ctx) の ctx.emit",
    `<script lang="ts">export default { setup(props, ctx) { ctx.emit("put"); } };</script>`,
  ],
  [
    "setup(props, { emit }) の分割代入",
    `<script lang="ts">export default { setup(props, { emit }) { emit("put"); } };</script>`,
  ],
  [
    "計算キーによるインスタンスの emit 参照",
    `<script setup lang="ts">import { getCurrentInstance } from "vue"; getCurrentInstance()?.["emit"]("put");</script>`,
  ],
  [
    "計算キーによる this.$emit 参照",
    `<script lang="ts">export default { mounted() { this["$emit"]("put"); } };</script>`,
  ],
  [
    "クォートキーによる emit の分割代入",
    `<script lang="ts">export default { setup(props, { "emit": send }) { send("put"); } };</script>`,
  ],
  [
    "Vue の useModel",
    `<script setup lang="ts">import { useModel } from "vue"; const model = useModel(defineProps<{ modelValue: string }>(), "modelValue"); model.value = "put";</script>`,
  ],
  [
    "別名でインポートした Vue の useModel",
    `<script setup lang="ts">import { useModel as modelRef } from "vue"; const model = modelRef(defineProps<{ modelValue: string }>(), "modelValue"); model.value = "put";</script>`,
  ],
  [
    "名前空間から参照した Vue.useModel",
    `<script setup lang="ts">import * as Vue from "vue"; const model = Vue.useModel(defineProps<{ modelValue: string }>(), "modelValue"); model.value = "put";</script>`,
  ],
  [
    "計算キーで参照した Vue.useModel",
    `<script setup lang="ts">import * as Vue from "vue"; const model = Vue["useModel"](defineProps<{ modelValue: string }>(), "modelValue"); model.value = "put";</script>`,
  ],
] as const;

describe("emit 禁止 lint", () => {
  it.each(DECLARATION_ROUTES)("宣言経路を塞ぐ: %s", async (_name, code) => {
    expect(await lintErrors(code)).toContain("no-restricted-syntax");
  });

  it("テンプレートの $emit を塞ぐ（宣言なし）", async () => {
    const code = `${EMIT_TEMPLATE}<script setup lang="ts"></script>`;

    expect(await lintErrors(code)).toContain("vue/require-explicit-emits");
  });

  it("emits という名前の通常のデータの分割代入は通る", async () => {
    const code = `<script setup lang="ts">const { emits } = JSON.parse('{}'); console.log(emits);</script>`;
    expect(await lintErrors(code)).toEqual([]);
  });

  it("Pinia アクションを直接呼ぶ正規の書き方は通る", async () => {
    const code = [
      `<template><button @click="put">x</button></template>`,
      `<script setup lang="ts">`,
      `import { useGameStore } from "@/stores/game";`,
      `const store = useGameStore();`,
      `function put() { store.putStone(0, 0); }`,
      `</script>`,
    ].join("");

    expect(await lintErrors(code)).toEqual([]);
  });
});
