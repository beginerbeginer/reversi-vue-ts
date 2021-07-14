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
    />
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
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
}
</script>
