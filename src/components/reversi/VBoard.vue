<template>
  <div>
    <VRow
      v-for="row in board.rows"
      :key="row.num"
      :row="row"
      @put="onPutEvent"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VRow from "@/components/reversi/VRow.vue";
import { Board } from "@/models/reversi";

@Component({
  components: {
    VRow,
  },
})
export default class VBoard extends Vue {
  @Prop({ required: true })
  //「!:」はundefinedを許容する型
  public board!: Board;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onPutEvent(x: number, y: number) {
    this.board.put(x, y);
  }
}
</script>
