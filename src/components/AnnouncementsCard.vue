<template>
  <!-- 公告横幅：仅展示最新一条，可关闭；点击进入详情弹窗 -->
  <transition name="banner-slide">
    <div v-if="items.length && !dismissed" class="announce-banner glass" role="button" @click="dialog = true">
      <v-icon color="primary" size="18" class="banner-icon">mdi-bullhorn-outline</v-icon>
      <span class="banner-text text-body-2">
        <span class="font-weight-medium">{{ latest.title }}</span>
        <span class="opacity-70">　{{ latestPlain }}</span>
      </span>
      <span v-if="items.length > 1" class="text-caption opacity-60 banner-more">+{{ items.length - 1 }}</span>
      <v-btn
        icon="mdi-close"
        size="x-small"
        variant="text"
        class="banner-close"
        aria-label="关闭公告"
        @click.stop="dismissed = true"
      />
    </div>
  </transition>

  <!-- 公告详情弹窗 -->
  <v-dialog v-model="dialog" max-width="520" scrollable>
    <v-card class="glass dialog-card" elevation="0">
      <div class="d-flex align-center px-5 pt-4 pb-3">
        <v-icon color="primary" class="mr-2">mdi-bullhorn-variant-outline</v-icon>
        <span class="font-display text-h6">公告</span>
        <v-spacer />
        <v-btn icon="mdi-close" size="small" variant="text" @click="dialog = false" />
      </div>
      <v-divider opacity="0.25" />
      <v-card-text class="px-5 py-4" style="max-height: 60vh">
        <div v-for="(a, i) in items" :key="i" class="announcement">
          <div class="d-flex align-baseline">
            <span class="font-weight-medium">{{ a.title }}</span>
            <span class="text-caption ml-auto opacity-70">{{ a.date }}</span>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="text-body-2 mt-1 opacity-80 announce-content" v-html="a.content" />
          <v-divider v-if="i < items.length - 1" class="my-3" opacity="0.3" />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// 公告来自前端静态文件，手编 public/announcements.json 即可生效
const items = ref([])
const dismissed = ref(false)
const dialog = ref(false)

const latest = computed(() => items.value[items.value.length - 1] ?? null)
// 横幅里的纯文本预览：去掉 HTML 标签
const latestPlain = computed(() => {
  if (!latest.value) return ''
  const div = document.createElement('div')
  div.innerHTML = latest.value.content ?? ''
  return div.textContent ?? ''
})

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

defineExpose({
  /** 有公告时可被父组件用于重新唤起横幅 */
  show() { dismissed.value = false }
})
</script>

<style scoped>
.announce-banner {
  position: fixed;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: min(680px, calc(100vw - 48px));
  padding: 8px 12px 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}
.announce-banner:hover {
  border-color: rgba(102, 204, 255, 0.45);
  box-shadow: 0 4px 24px rgba(102, 204, 255, 0.25);
}
.banner-icon {
  flex-shrink: 0;
}
.banner-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.banner-more {
  flex-shrink: 0;
  color: var(--tianyi);
}
.banner-close {
  flex-shrink: 0;
}

.banner-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.banner-slide-leave-active {
  transition: all 0.3s ease;
}
.banner-slide-enter-from,
.banner-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-14px);
}

.dialog-card {
  border-radius: 20px;
}

.announce-content :deep(a) {
  color: var(--tianyi);
}
</style>
