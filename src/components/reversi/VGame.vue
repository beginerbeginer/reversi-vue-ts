<template>
  <v-container>
    <v-layout justify-center>
      <VBoard :board="board" />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import VBoard from "@/components/reversi/VBoard.vue";
import { Board } from "@/models/reversi";

@Component({
  components: {
    VBoard,
  },
})
export default class VGame extends Vue {
  public board: Board = new Board();
}
</script>
