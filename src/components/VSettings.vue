<template>
  <v-container>
    <h1 class="text-h5 mb-4">設定</h1>
    <v-list lines="two">
      <v-list-subheader>アシスト機能</v-list-subheader>
      <v-list-item
        title="ホバープレビュー"
        subtitle="置ける場所にマウスを乗せたとき、石を半透明で表示する"
      >
        <template #append>
          <v-switch
            v-model="settings.hoverPreview"
            data-testid="hover-preview-switch"
            color="primary"
            hide-details
          />
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();
</script>
