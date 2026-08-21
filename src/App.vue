<template>
  <v-app>
    <div class="aurora-bg" />

    <!-- 3D 粒子天依：全屏背景层，进度条走完后在右下角凝聚 -->
    <ParticleLty :low-power="lowPower" :gathering="gathering" @ready="onParticlesReady" />

    <!-- 顶栏 -->
    <v-app-bar flat color="transparent" class="px-4" style="z-index: 2">
      <v-app-bar-title class="font-display text-h5 title-glow" style="color: var(--tianyi)">
        VocalTTS
      </v-app-bar-title>
      <v-spacer />
      <v-tooltip text="低功耗模式（关闭 3D 粒子）" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon variant="text" @click="lowPower = !lowPower">
            <v-icon :color="lowPower ? 'primary' : undefined">
              {{ lowPower ? 'mdi-leaf' : 'mdi-leaf-off' }}
            </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-btn icon variant="text" @click="toggleTheme">
        <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="position: relative; z-index: 1">
      <v-container class="py-6" style="max-width: 760px">
        <div class="text-center mb-6 content-item" :class="{ show: contentShown }">
          <div class="font-display text-h3 title-glow" :style="{ color: 'var(--tianyi)' }">
            让天依为你发声
          </div>
          <div class="text-body-2 opacity-70 mt-1">在线语音合成 · 仅供学习交流</div>
        </div>

        <!-- 合成面板 -->
        <v-card class="glass pa-6 content-item" :class="{ show: contentShown }" elevation="0">
           <!-- 发音人：角色档案式选择器 -->
           <div class="speaker-heading">
             <div>
               <div class="section-kicker">VOICE LIBRARY</div>
               <div class="text-subtitle-1 font-weight-medium">选择发音人</div>
             </div>
             <div class="speaker-count">
               <span class="live-dot" /> {{ models.length || 0 }} 个音色
             </div>
           </div>

           <div v-if="selectedModel" class="selected-voice glass-inner">
             <div class="selected-avatar-wrap">
               <v-avatar size="64" class="selected-avatar">
                 <v-img :src="selectedModel.avatar" :alt="selectedModel.name" cover />
               </v-avatar>
               <span class="avatar-ring" />
             </div>
             <div class="selected-copy">
               <div class="selected-label">CURRENT VOICE</div>
               <div class="font-display text-h5">{{ selectedModel.name }}</div>
               <div class="text-caption opacity-70">{{ selectedModel.description || 'VoxCPM 音色' }}</div>
             </div>
             <div class="selected-state">
               <v-icon size="16" color="primary">mdi-check-decagram</v-icon>
               <span>已选择</span>
             </div>
           </div>

           <div v-if="models.length" class="speaker-grid">
             <button
               v-for="m in models"
               :key="m.id"
               type="button"
               class="speaker-option"
               :class="{ active: form.model === m.id }"
               @click="form.model = m.id"
             >
               <span class="option-avatar">
                 <v-img :src="m.avatar" :alt="m.name" cover />
               </span>
               <span class="option-info">
                 <span class="option-name">{{ m.name }}</span>
                 <span class="option-desc">{{ m.description || 'VoxCPM 音色' }}</span>
               </span>
               <v-icon v-if="form.model === m.id" size="18" color="primary">mdi-check-circle</v-icon>
             </button>
           </div>
           <div v-if="modelsError" class="text-caption text-error mt-1">{{ modelsError }}</div>

          <!-- 文本 -->
          <div class="text-subtitle-2 mt-5 mb-2 opacity-80">合成文本</div>
          <v-textarea
            v-model="form.text"
            placeholder="输入想让天依说的话…"
            rows="4"
            counter="500"
            maxlength="500"
            variant="outlined"
            hide-details="auto"
          />

          <!-- 模式 -->
          <div class="text-subtitle-2 mt-4 mb-2 opacity-80">合成模式</div>
          <v-btn-toggle v-model="form.mode" mandatory rounded="lg" color="primary" density="comfortable">
            <v-btn value="standard">
              <v-icon start>mdi-microphone</v-icon>标准音色
            </v-btn>
            <v-btn value="emotion">
              <v-icon start>mdi-emoticon-happy-outline</v-icon>情感模式
            </v-btn>
          </v-btn-toggle>
          <v-expand-transition>
            <v-text-field
              v-if="form.mode === 'emotion'"
              v-model="form.voiceInstruction"
              class="mt-4"
              variant="outlined"
              density="comfortable"
              placeholder="例如：语速稍快、开心的语气"
              prepend-inner-icon="mdi-tune"
              hide-details
            />
          </v-expand-transition>

          <!-- 合成 -->
          <v-btn
            class="mt-5 synth-btn"
            color="primary"
            size="large"
            block
            :loading="loading"
            :disabled="!form.text.trim()"
            @click="doSynth"
          >
            <v-icon start>mdi-auto-fix</v-icon>
            {{ loading ? '合成中，请稍候…' : '开始合成' }}
          </v-btn>

          <v-expand-transition>
            <div v-if="audio">
              <v-divider class="my-5" opacity="0.3" />
              <div class="d-flex align-center flex-wrap" style="gap: 12px">
                <audio :src="audio.blobUrl" controls class="audio-player" />
                <v-btn variant="tonal" color="primary" @click="download">
                  <v-icon start>mdi-download</v-icon>下载
                </v-btn>
              </div>
            </div>
          </v-expand-transition>
        </v-card>

      </v-container>
      <SiteFooter :visible="contentShown" />
    </v-main>

    <!-- 公告：顶栏下方玻璃横幅（最新一条），点击展开完整列表弹窗 -->
    <AnnouncementsCard v-if="contentShown" />

    <!-- 开场加载层：粒子聚合期间的全屏遮罩 -->
    <transition name="loader-fade">
      <div v-if="loaderVisible" class="loader-overlay">
        <div class="font-display loader-logo">VocalTTS</div>
        <div class="loader-sub font-display">正在唤醒天依…</div>
        <div class="loader-bar">
          <div class="loader-bar-fill" :style="{ width: loaderProgress + '%' }" />
        </div>
        <div class="loader-tip text-caption">{{ loaderTip }}</div>
      </div>
    </transition>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useTheme } from 'vuetify'
import ParticleLty from './components/ParticleLty.vue'
import AnnouncementsCard from './components/AnnouncementsCard.vue'
import SiteFooter from './components/SiteFooter.vue'
import { extFromMime, fetchModels, synthesize } from './api/tts'

const theme = useTheme()

const lowPower = ref(false)
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'tianyiLight' : 'tianyiDark'
}

// ============ 开场加载 ============
// 流程：进度条走完（约1.4s）→ 粒子在右下角开始凝聚（tip 切换）
//       → 凝聚到 85%（ready）→ 加载层淡出、内容浮现
const loaderVisible = ref(true)
const loaderProgress = ref(0)
const loaderTip = ref('正在唤醒天依…')
const gathering = ref(false)
const contentShown = ref(false)
let loaderTimer = null
let finished = false

function startLoader() {
  const t0 = performance.now()
  loaderTimer = setInterval(() => {
    const elapsed = performance.now() - t0
    loaderProgress.value = Math.min(100, (elapsed / 1400) * 100)
    if (loaderProgress.value >= 100) {
      clearInterval(loaderTimer)
      loaderTip.value = '粒子凝聚中…'
      gathering.value = true
    }
  }, 50)
}

function onParticlesReady() {
  if (finished) return
  finished = true
  loaderVisible.value = false
  // 加载层淡出后内容浮现，并预取发音人列表
  setTimeout(() => { contentShown.value = true }, 400)
  loadModels()
}

onMounted(startLoader)
onBeforeUnmount(() => clearInterval(loaderTimer))

// ============ 合成状态 ============
const models = ref([])
const modelsError = ref('')
const form = reactive({
  model: 'lty',
  text: '',
  mode: 'standard',
  voiceInstruction: ''
})
const selectedModel = computed(() => models.value.find((m) => m.id === form.model) ?? models.value[0] ?? null)
const loading = ref(false)
const audio = ref(null)
const snackbar = reactive({ show: false, text: '', color: 'error' })

function toast(text, color = 'error') {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

async function loadModels() {
  try {
    models.value = await fetchModels()
    if (models.value.length) form.model = models.value[0].id
  } catch (e) {
    modelsError.value = `发音人列表加载失败：${e.message}`
  }
}

async function doSynth() {
  if (loading.value) return
  loading.value = true
  audio.value = null
  try {
    audio.value = await synthesize({
      model: form.model,
      input: form.text,
      mode: form.mode,
      voice_instruction: form.mode === 'emotion' ? form.voiceInstruction : ''
    })
    toast('合成完成', 'success')
  } catch (e) {
    toast(`合成失败：${e.message}`)
  } finally {
    loading.value = false
  }
}

function download() {
  if (!audio.value) return
  const a = document.createElement('a')
  a.href = audio.value.blobUrl
  a.download = `${form.model}-${Date.now()}.${extFromMime(audio.value.mime)}`
  a.click()
}
</script>

<style scoped>
/* ===== 内容入场 ===== */
.content-item {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.content-item.show {
  opacity: 1;
  transform: translateY(0);
}

/* ===== 发音人：角色档案选择器 ===== */
.speaker-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 12px;
}
.section-kicker,
.selected-label {
  color: var(--tianyi);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}
.speaker-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(160, 190, 215, 0.85);
  font-size: 0.72rem;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tianyi);
  box-shadow: 0 0 8px var(--tianyi);
}
.glass-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 92px;
  margin-bottom: 12px;
  padding: 13px 16px;
  overflow: hidden;
  border: 1px solid rgba(102, 204, 255, 0.3);
  border-radius: 18px;
  background: linear-gradient(115deg, rgba(102, 204, 255, 0.16), rgba(118, 85, 196, 0.06));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 5px 22px rgba(102, 204, 255, 0.1);
}
.glass-inner::after {
  position: absolute;
  top: -55px;
  right: 10%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 204, 255, 0.16), transparent 70%);
  content: '';
  pointer-events: none;
}
.selected-avatar-wrap {
  position: relative;
  flex: 0 0 64px;
  height: 64px;
  isolation: isolate;
}
.selected-avatar-wrap::before,
.selected-avatar-wrap::after {
  position: absolute;
  z-index: -1;
  inset: -4px;
  border: 1px solid rgba(102, 204, 255, .7);
  border-radius: 50%;
  content: '';
  pointer-events: none;
  animation: voice-ripple 2.8s cubic-bezier(.16, .7, .3, 1) infinite;
}
.selected-avatar-wrap::after {
  animation-delay: 1.4s;
}
.selected-avatar {
  position: relative;
  z-index: 1;
  border: 2px solid rgba(234, 255, 255, .8);
  box-shadow: 0 0 18px rgba(102, 204, 255, .55);
}
.avatar-ring {
  position: absolute;
  inset: -5px;
  border: 1px solid rgba(102, 204, 255, .55);
  border-radius: 50%;
  animation: avatar-orbit 3.2s linear infinite;
}
.selected-copy { min-width: 0; }
.selected-copy .text-h5 { line-height: 1.1; }
.selected-state {
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  color: var(--tianyi);
  font-size: 0.72rem;
  white-space: nowrap;
}
.speaker-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.speaker-option {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 9px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  border: 1px solid rgba(102, 204, 255, .12);
  border-radius: 13px;
  outline: none;
  background: rgba(102, 204, 255, .035);
  transition: transform .23s ease, border-color .23s ease, background .23s ease, box-shadow .23s ease;
}
.speaker-option:hover,
.speaker-option:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(102, 204, 255, .5);
  background: rgba(102, 204, 255, .10);
}
.speaker-option.active {
  border-color: var(--tianyi);
  background: rgba(102, 204, 255, .14);
  box-shadow: 0 0 15px rgba(102, 204, 255, .16);
}
.option-avatar {
  display: block;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 50%;
}
.option-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  margin-left: 8px;
}
.option-name,
.option-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.option-name { font-size: .78rem; font-weight: 600; }
.option-desc { margin-top: 2px; opacity: .6; font-size: .63rem; }
@keyframes avatar-orbit {
  to { transform: rotate(360deg); }
}
@keyframes voice-ripple {
  0% {
    opacity: 0;
    transform: scale(.92);
    box-shadow: 0 0 0 0 rgba(102, 204, 255, .48);
  }
  12% { opacity: .75; }
  72% { opacity: .18; }
  100% {
    opacity: 0;
    transform: scale(1.95);
    box-shadow: 0 0 18px 4px rgba(102, 204, 255, 0);
  }
}
@media (max-width: 560px) {
  .speaker-grid { grid-template-columns: 1fr; }
  .option-avatar { flex-basis: 38px; width: 38px; height: 38px; }
}
@media (prefers-reduced-motion: reduce) {
  .selected-avatar-wrap::before,
  .selected-avatar-wrap::after,
  .avatar-ring { animation: none; }
}

.synth-btn {
  box-shadow: 0 4px 24px rgba(102, 204, 255, 0.35);
  transition: box-shadow 0.3s ease;
}
.synth-btn:hover:not(:disabled) {
  box-shadow: 0 6px 36px rgba(102, 204, 255, 0.55);
}

.audio-player {
  flex: 1;
  min-width: 220px;
  height: 40px;
}

/* ===== 开场加载层 ===== */
.loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 透明背景：让散落的粒子与聚合过程直接可见 */
  background: transparent;
  pointer-events: none;
}
.loader-logo {
  font-size: 3rem;
  color: var(--tianyi);
  letter-spacing: 0.08em;
  animation: glow-pulse 2s ease-in-out infinite;
}
.loader-sub {
  margin-top: 6px;
  font-size: 1rem;
  color: rgba(234, 255, 255, 0.6);
  letter-spacing: 0.3em;
}
.loader-bar {
  margin-top: 28px;
  width: min(320px, 60vw);
  height: 3px;
  border-radius: 2px;
  background: rgba(102, 204, 255, 0.15);
  overflow: hidden;
}
.loader-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(102, 204, 255, 0.5), #66ccff);
  box-shadow: 0 0 12px rgba(102, 204, 255, 0.8);
  transition: width 0.15s linear;
}
.loader-tip {
  margin-top: 14px;
  color: rgba(234, 255, 255, 0.45);
  letter-spacing: 0.2em;
}

.loader-fade-leave-active {
  transition: opacity 1s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>
