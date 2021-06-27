<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Reversi</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  data: () => ({}),
});
</script>
