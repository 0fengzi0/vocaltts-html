<template>
  <v-card v-if="items.length" class="glass pa-5 shimmer-in" elevation="0">
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-bullhorn-outline</v-icon>
      <span class="font-display text-h6">公告</span>
    </div>
    <div v-for="(a, i) in items" :key="i" class="announcement">
      <div class="d-flex align-baseline">
        <span class="font-weight-medium">{{ a.title }}</span>
        <span class="text-caption ml-auto opacity-70">{{ a.date }}</span>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="text-body-2 mt-1 opacity-80" v-html="a.content" />
      <v-divider v-if="i < items.length - 1" class="my-3" opacity="0.3" />
    </div>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// 公告来自前端静态文件，手编 public/announcements.json 即可生效
const items = ref([])

onMounted(async () => {
  try {
    const resp = await fetch(`${import.meta.env.BASE_URL}announcements.json`, { cache: 'no-cache' })
    if (!resp.ok) return
    const j = await resp.json()
    items.value = Array.isArray(j.items) ? j.items : []
  } catch {
    // 无公告或文件缺失时静默隐藏
  }
})
</script>
