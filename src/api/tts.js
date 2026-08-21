// VocalTTS API 客户端
// OpenAI 风格接口 + HMAC-SHA256 动态时间戳签名
//
// 构建期注入：
//   VITE_API_BASE_URL  后端地址，如 https://api.example.com（开发时可留空走相对路径+proxy）
//   VITE_API_SECRET    与后端共享的签名密钥
const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const SECRET = import.meta.env.VITE_API_SECRET ?? 'CHANGE_ME_VOCALTTS_SHARED_SECRET'

const enc = new TextEncoder()

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
}

// 生成签名头：hex(HMAC(secret, ts + "\n" + METHOD + "\n" + path + "\n" + body))
async function signHeaders(method, path, bodyStr) {
  const ts = Math.floor(Date.now() / 1000).toString()
  const sig = await hmacHex(SECRET, `${ts}\n${method}\n${path}\n${bodyStr}`)
  return { 'X-Timestamp': ts, 'X-Signature': sig }
}

async function parseError(resp) {
  try {
    const j = await resp.json()
    return j?.error?.message ?? `HTTP ${resp.status}`
  } catch {
    return `HTTP ${resp.status}`
  }
}

/** 获取发音人列表 GET /v1/models → [{id,name,avatar,description}] */
export async function fetchModels() {
  const path = '/v1/models'
  const headers = await signHeaders('GET', path, '')
  const resp = await fetch(BASE + path, { headers })
  if (!resp.ok) throw new Error(await parseError(resp))
  const j = await resp.json()
  return j.data ?? []
}

/**
 * 语音合成 POST /v1/audio/speech → { blob, blobUrl, mime }
 * @param {{model: string, input: string, mode?: string, voice_instruction?: string}} payload
 */
export async function synthesize(payload) {
  const path = '/v1/audio/speech'
  const bodyStr = JSON.stringify(payload)
  const headers = {
    'Content-Type': 'application/json',
    ...(await signHeaders('POST', path, bodyStr))
  }
  const resp = await fetch(BASE + path, { method: 'POST', headers, body: bodyStr })
  if (!resp.ok) throw new Error(await parseError(resp))
  const blob = await resp.blob()
  const mime = blob.type || 'audio/mpeg'
  return { blob, blobUrl: URL.createObjectURL(blob), mime }
}

/** 从 mime 推导下载文件扩展名 */
export function extFromMime(mime) {
  if (mime.includes('wav')) return 'wav'
  if (mime.includes('mpeg') || mime.includes('mp3')) return 'mp3'
  return 'audio'
}
