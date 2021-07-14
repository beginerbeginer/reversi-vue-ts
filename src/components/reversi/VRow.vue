<!--
- keyに一意になる値を書く
- xとyを繋いだ値をkeyに代入する
- rowのオブジェクトをもつcellを１つずつVCellのコンポーネントにバインドしている
-->
<template>
  <v-layout>
    <VCell
      v-for="cell in row.cells"
      :key="`${cell.x}-${cell.y}`"
      :cell="cell"
      @put="onPutEvent"
    />
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import VCell from "@/components/reversi/VCell.vue";
import { Row } from "@/models/reversi";

@Component({
  components: {
    VCell,
  },
})
export default class VRow extends Vue {
  @Prop({ required: true })
  public row!: Row;

  /* Vuejsの基本はprops up , event down
   * @Emitを使うことで親コンポーネント（VBoard）にputイベントを渡すことができる
   */
  @Emit("put")
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public put(x: number, y: number) {
    console.log(x, y);
    console.log("↑VRowのput終了");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onPutEvent(x: number, y: number) {
    this.put(x, y);
  }
}
</script>
