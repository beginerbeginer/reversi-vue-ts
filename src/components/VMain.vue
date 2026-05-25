<template>
  <v-container fluid>
    <div class="d-flex justify-center">
      <v-btn color="primary" variant="outlined" @click="router.push('/game')">
        ゲームスタート！！
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>
