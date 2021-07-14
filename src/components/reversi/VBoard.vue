<template>
  <div>
    <VRow />
    <VRow />
    <VRow />
    <VRow />
    <VRow />
    <VRow />
    <VRow />
    <VRow />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import VRow from "@/components/reversi/VRow.vue";

@Component({
  components: {
    VRow,
  },
})
export default class VBoard extends Vue {}
</script>
