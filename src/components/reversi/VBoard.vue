<template>
  <div>
    <VRow v-for="row in board.rows" :key="row.num" :row="row" />
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
  public board!: Board;
}
</script>
