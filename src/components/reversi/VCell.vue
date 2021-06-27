<template>
  <div class="cell-wrapper">
    <div class="cell"></div>
    <div class="stone"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class VCell extends Vue {}
</script>

<style scoped>
.cell-wrapper {
  position: relative;
}

.cell {
  height: 64px;
  width: 64px;
  background-color: darkgreen;
  border: 2px solid black;
}

.stone {
  position: absolute;
  top: 2px;
  left: 2px;
  /* 石のサイズ */
  height: 60px;
  width: 60px;
  /* 石の形 */
  border-radius: 50%;
  /* 石の色 */
  /* background-color: white; */
}

.white-stone{
  background-color: white;
}

.black-stone{
  background-color: black;
}
</style>

