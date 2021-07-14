<template>
  <div class="cell-wrapper" @click="onClick">
    <div class="cell"></div>
    <div class="stone" :class="stoneClass"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { Cell, Point } from "@/models/reversi";

@Component
export default class VCell extends Vue {
  @Prop({ required: true })

  //「!」はundefinedを許容する型
  public cell!: Cell;

  // public created() {
  // }

  /* Vuejsの基本はprops up , event down
   * @Emitを使うことで親コンポーネント（VRow）にputイベントを渡すことができる
   */
  @Emit("put")
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public put(p: Point) {
    console.log(p);
    console.log("↑VCellのput終了");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onClick() {
    this.put(new Point(this.cell.x, this.cell.y));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get stoneClass() {
    return {
      "white-stone": this.cell.isWhite,
      "black-stone": this.cell.isBlack,
    };
  }
}
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

.white-stone {
  background-color: white;
}

.black-stone {
  background-color: black;
}
</style>
