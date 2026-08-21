<template>
  <div ref="wrap" class="particle-stage">
    <!-- 低功耗模式：右下角静态图片，不启动 WebGL -->
    <img v-if="lowPower && staticUrl" :src="staticUrl" class="static-lty" alt="洛天依" />
    <div v-else ref="glMount" class="fill-canvas" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  lowPower: { type: Boolean, default: false },
  // 外层进度条走完后置 true：粒子开始在看板位凝聚
  gathering: { type: Boolean, default: false }
})
const emit = defineEmits(['ready'])

const wrap = ref(null)
const glMount = ref(null)
const staticUrl = ref('')

// 粒子采样目标图（不入库，部署时放置在 public/ 下，按顺序探测）
const IMAGE_URLS = [
  `${import.meta.env.BASE_URL}lty.webp`,
  `${import.meta.env.BASE_URL}lty.png`,
  `${import.meta.env.BASE_URL}lty.jpg`
]
const WORLD_H = 7      // 形象在世界坐标中的高度
const GATHER_MS = 2200 // 凝聚动画时长
const CAM_Z = 14

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const im = new Image()
    im.onload = () => resolve(im)
    im.onerror = reject
    im.src = url
  })
}

/** 返回 { img, url }；全部缺失时抛出 */
async function loadFirstImage() {
  for (const url of IMAGE_URLS) {
    try {
      const img = await loadImage(url)
      return { img, url }
    } catch { /* 尝试下一个 */ }
  }
  throw new Error('public/ 下未找到 lty 形象图（lty.webp / lty.png / lty.jpg）')
}

/* ==================== 粒子采样 ====================
 * 非白色背景像素即形象本体，颜色直接取原图。
 */
async function sampleParticles(count) {
  const { img } = await loadFirstImage()
  const sw = 160
  const sh = Math.round((img.naturalHeight / img.naturalWidth) * sw)
  const cvs = document.createElement('canvas')
  cvs.width = sw
  cvs.height = sh
  const ctx = cvs.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, sw, sh)
  const { data } = ctx.getImageData(0, 0, sw, sh)

  const candidates = []
  for (let i = 0; i < sw * sh; i++) {
    const o = i * 4
    if (data[o + 3] < 40) continue
    const r = data[o], g = data[o + 1], b = data[o + 2]
    if (r > 240 && g > 240 && b > 240) continue
    candidates.push(i)
  }
  if (candidates.length === 0) return null

  const worldW = WORLD_H * (sw / sh)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const sizes = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const idx = candidates[Math.floor(Math.random() * candidates.length)]
    const px = idx % sw, py = (idx / sw) | 0
    positions[i * 3] = ((px + Math.random()) / sw - 0.5) * worldW
    positions[i * 3 + 1] = (0.5 - (py + Math.random()) / sh) * WORLD_H
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4
    const o = idx * 4
    colors[i * 3] = data[o] / 255
    colors[i * 3 + 1] = data[o + 1] / 255
    colors[i * 3 + 2] = data[o + 2] / 255
    phases[i] = Math.random() * Math.PI * 2
    const lum = (0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]) / 255
    sizes[i] = 0.35 + lum * 0.9 + Math.random() * 0.4
  }
  return { positions, colors, phases, sizes, count }
}

/* ==================== 低功耗模式 ==================== */
async function enterStaticMode() {
  if (staticUrl.value) {
    emit('ready')
    return
  }
  try {
    const { url } = await loadFirstImage()
    staticUrl.value = url
  } catch { /* 无图时留空 */ }
  emit('ready')
}

/* ==================== 3D 粒子模式 ==================== */
let three = null
let gatherPending = false // three 尚未就绪时收到的 gathering 信号

async function initThree() {
  const THREE = await import('three')
  const mount = glMount.value
  if (!mount) return

  const COUNT = 14000
  let sample = null
  try {
    sample = await sampleParticles(COUNT)
  } catch { /* 图片缺失 */ }
  if (!glMount.value) return // 等待期间被卸载
  if (!sample) {
    // 图片缺失：跳过 3D，直接通知就绪
    emit('ready')
    return
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
  camera.position.set(0, 0, CAM_Z)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  mount.appendChild(renderer.domElement)

  // z=0 平面上的可视世界尺寸（用于散布起点 + 看板位坐标）
  const halfH = Math.tan((camera.fov / 2) * Math.PI / 180) * CAM_Z
  let halfW = halfH * (wrap.value.clientWidth / Math.max(1, wrap.value.clientHeight))

  // 散落起点：无序铺满全屏可视范围（稍溢出），z 随机深度
  const starts = new Float32Array(sample.count * 3)
  for (let i = 0; i < sample.count; i++) {
    starts[i * 3] = (Math.random() * 2 - 1) * halfW * 1.25
    starts[i * 3 + 1] = (Math.random() * 2 - 1) * halfH * 1.25
    starts[i * 3 + 2] = (Math.random() - 0.5) * 6
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(sample.positions, 3)) // 目标位置
  geo.setAttribute('aStart', new THREE.BufferAttribute(starts, 3))             // 散布起点
  geo.setAttribute('aColor', new THREE.BufferAttribute(sample.colors, 3))
  geo.setAttribute('aPhase', new THREE.BufferAttribute(sample.phases, 1))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sample.sizes, 1))

  const uniforms = {
    uTime: { value: 0 },
    uGather: { value: 0 }, // 0=全散开 1=凝聚完成
    uIdle: { value: 0 },   // 待机浮动强度（渐入）
    uPixelRatio: { value: 1 }
  }

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute vec3 aStart;
      attribute vec3 aColor;
      attribute float aPhase;
      attribute float aSize;
      uniform float uTime;
      uniform float uGather;
      uniform float uIdle;
      uniform float uPixelRatio;
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vColor = aColor;
        float g = uGather;
        float inv = 1.0 - g;
        // 凝聚路径：起点→目标，途中绕一条随机轴旋涡收拢
        vec3 dir = aStart - position;
        float ang = inv * 7.0 + aPhase;
        vec3 axis = normalize(vec3(sin(aPhase * 3.1), cos(aPhase * 2.3), sin(aPhase * 1.7)));
        vec3 swirl = cross(axis, normalize(dir + axis * 0.001)) * sin(ang) * inv * 2.4;
        vec3 p = mix(aStart, position, g) + swirl;
        // 待机浮动（uIdle 渐入）
        p += uIdle * vec3(
          sin(uTime * 0.7 + aPhase * 7.0) * 0.045,
          cos(uTime * 0.55 + aPhase * 5.0) * 0.05,
          sin(uTime * 0.4 + aPhase * 3.0) * 0.035
        );
        vTwinkle = 0.6 + 0.4 * sin(uTime * 2.2 + aPhase * 9.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aSize * uPixelRatio * 26.0 / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float alpha = smoothstep(0.5, 0.08, d) * vTwinkle;
        // 提亮原色，叠一点天依蓝辉光
        vec3 col = vColor * 1.15 + vec3(0.16, 0.30, 0.36) * 0.35;
        gl_FragColor = vec4(col, alpha * 0.85);
      }`
  })

  const points = new THREE.Points(geo, mat)
  const group = new THREE.Group()
  group.add(points)
  scene.add(group)

  // ---- 位置：固定右下角看板位（凝聚也在此完成）----
  const view = {
    pos: { x: 0, y: 0 },
    x: 0, y: 0,       // 看板位目标，resize 时重算
    scale: 0.55,
    idle: 0,
    gatherStart: -1
  }
  function calcCorner() {
    if (!wrap.value) return
    halfW = halfH * (wrap.value.clientWidth / Math.max(1, wrap.value.clientHeight))
    const s = view.scale
    view.x = halfW - (WORLD_H * s) * 0.5 * 0.62 - 0.4
    view.y = -halfH + (WORLD_H * s) * 0.5 + 0.35
  }
  calcCorner()
  view.pos.x = view.x
  view.pos.y = view.y

  // 指针视差
  const pointer = { x: 0, y: 0 }
  const onPointer = (e) => {
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    pointer.x = (cx / window.innerWidth - 0.5) * 2
    pointer.y = (cy / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('touchmove', onPointer, { passive: true })

  function resize() {
    if (!wrap.value) return
    const w = wrap.value.clientWidth, h = wrap.value.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(w, h)
    uniforms.uPixelRatio.value = dpr
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    calcCorner()
  }
  window.addEventListener('resize', resize)
  resize()

  const clock = new THREE.Clock()
  let rafId = 0
  let readyEmitted = false
  const easeInOut = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2

  function loop() {
    rafId = requestAnimationFrame(loop)
    const t = clock.getElapsedTime()
    uniforms.uTime.value = t

    // 凝聚进度：外层进度条走完后才启动
    if (view.gathering && view.gatherStart < 0) view.gatherStart = t
    const progress = view.gatherStart < 0 ? 0 : Math.min(1, ((t - view.gatherStart) * 1000) / GATHER_MS)
    uniforms.uGather.value = easeInOut(progress)
    if (progress >= 0.85 && !readyEmitted) {
      readyEmitted = true
      emit('ready')
    }

    // 待机：强度渐入（散落时 0.4 微尘漂浮，凝聚完成后 1）
    view.idle += (((progress > 0.95) ? 1 : 0.4) - view.idle) * 0.01
    uniforms.uIdle.value = view.idle
    const amp = view.idle * 0.7
    group.position.x = view.x
    group.position.y = view.y + Math.sin(t * 0.8) * 0.18 * amp
    group.scale.setScalar(view.scale * (1 + Math.sin(t * 1.1) * 0.022 * amp))
    group.rotation.z = Math.sin(t * 0.35) * 0.02 * amp
    group.rotation.y += ((pointer.x * 0.3) - group.rotation.y) * 0.04
    group.rotation.x += ((-pointer.y * 0.15) - group.rotation.x) * 0.04
    renderer.render(scene, camera)
  }

  view.gathering = props.gathering || gatherPending
  loop()

  three = {
    setGathering(v) {
      view.gathering = v
    },
    dispose() {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('touchmove', onPointer)
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      three = null
    }
  }
}

function destroyThree() {
  if (three) three.dispose()
}

watch(() => props.lowPower, async (low) => {
  if (low) {
    destroyThree()
    await enterStaticMode()
  } else {
    await initThree()
  }
})

watch(() => props.gathering, (v) => {
  if (three) three.setGathering(v)
  else gatherPending = v
})

onMounted(async () => {
  if (props.lowPower) {
    await enterStaticMode()
  } else {
    await initThree()
  }
})

onBeforeUnmount(destroyThree)
</script>

<style scoped>
/* 全屏背景层：独立于页面布局，位于内容与极光背景之间 */
.particle-stage {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.fill-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.fill-canvas :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
.static-lty {
  position: absolute;
  right: 3%;
  bottom: 2%;
  height: 62%;
  max-width: 40%;
  object-fit: contain;
  filter: drop-shadow(0 0 24px rgba(102, 204, 255, 0.55));
}
</style>
