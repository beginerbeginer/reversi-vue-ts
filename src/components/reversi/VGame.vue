<template>
  <v-container>
    <v-layout justify-center>
      <VBoard/>
    </v-layout>

  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import VBoard from "@/components/reversi/VBoard.vue";

@Component({
  components: {
    VBoard,
  },
})
export default class VGame extends Vue {}
</script>
