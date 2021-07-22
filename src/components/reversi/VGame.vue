<template>
  <v-container>
    <v-layout justify-center>
      <VBoard :board="board" />
    </v-layout>

    <v-layout justify-center>
      <h1>{{ current }}</h1>
    </v-layout>
    <v-layout justify-center>
      <h1>白の手番：{{ board.whites }}</h1>
    </v-layout>
    <v-layout justify-center>
      <h1>黒の手番：{{ board.blacks }}</h1>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import VBoard from "@/components/reversi/VBoard.vue";
import { Board, CellState } from "@/models/reversi";

@Component({
  components: {
    VBoard,
  },
})
export default class VGame extends Vue {
  public board: Board = new Board();

  public get current(): string {
    if (this.board.turn === CellState.Black) {
      return "黒の手番";
    } else {
      return "白の手番";
    }
  }
}
</script>
