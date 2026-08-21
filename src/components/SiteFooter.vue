<template>
  <footer v-if="meta" class="site-footer content-item" :class="{ show: visible }">
    <div class="footer-line">
      <div class="footer-stat">
        <v-icon size="15" color="primary">mdi-timer-sand-complete</v-icon>
        <span>已运行 <strong>{{ runningDays }}</strong> 天</span>
      </div>
      <span class="footer-divider" />
      <div class="footer-version">
        <v-icon size="15">mdi-tag-outline</v-icon>
        <span>VocalTTS v{{ packageVersion }}</span>
      </div>
    </div>

    <nav v-if="meta.links?.length" class="friend-links" aria-label="友情链接">
      <span class="friend-label">友情链接</span>
      <a
        v-for="link in meta.links"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ link.name }}
        <v-icon size="11">mdi-open-in-new</v-icon>
      </a>
    </nav>
  </footer>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import packageJson from '../../package.json'

defineProps({ visible: { type: Boolean, default: false } })

const meta = ref(null)
const now = ref(Date.now())
let timer = null
const packageVersion = packageJson.version

const runningDays = computed(() => {
  if (!meta.value?.launchedAt) return 0
  const start = new Date(meta.value.launchedAt).getTime()
  if (!Number.isFinite(start)) return 0
  return Math.max(0, Math.floor((now.value - start) / 86_400_000))
})

onMounted(async () => {
  try {
    const resp = await fetch(`${import.meta.env.BASE_URL}site-meta.json`, { cache: 'no-cache' })
    if (resp.ok) meta.value = await resp.json()
  } catch {
    // 页脚配置缺失时不展示，不影响主功能。
  }
  // 每小时更新一次，跨午夜时运行天数会自然递增。
  timer = window.setInterval(() => { now.value = Date.now() }, 3_600_000)
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<style scoped>
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  max-width: 760px;
  margin: 38px auto 20px;
  padding: 13px 18px;
  color: rgba(178, 203, 223, .76);
  font-size: .74rem;
  border-top: 1px solid rgba(102, 204, 255, .16);
}
.footer-line,
.footer-stat,
.footer-version,
.friend-links,
.friend-links a {
  display: flex;
  align-items: center;
}
.footer-line { gap: 10px; white-space: nowrap; }
.footer-stat,
.footer-version { gap: 5px; }
.footer-stat strong { color: var(--tianyi); font-weight: 700; }
.footer-divider { width: 1px; height: 13px; background: rgba(102, 204, 255, .22); }
.friend-links { flex-wrap: wrap; justify-content: flex-end; gap: 10px; }
.friend-label { color: rgba(178, 203, 223, .5); }
.friend-links a {
  gap: 3px;
  color: inherit;
  text-decoration: none;
  transition: color .2s ease, text-shadow .2s ease;
}
.friend-links a:hover { color: var(--tianyi); text-shadow: 0 0 9px rgba(102, 204, 255, .6); }
@media (max-width: 600px) {
  .site-footer { flex-direction: column; align-items: center; margin-top: 28px; text-align: center; }
  .friend-links { justify-content: center; }
}
</style>
