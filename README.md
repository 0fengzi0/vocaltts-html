# vocaltts-html

## 关于此项目

本项目为 VOCALTTS 的前端（Vue 3 + Vite + Vuetify）与胶水后端（Go，调 VoxCPM 推理）。
开源本项目只是希望能为一些学习前端的同学提供一些帮（wu）助（dao），同时也作为自己在前端学习上的实践之地。如果你对某些地方有更好的解决方法，欢迎提出。

-------------------------------

## 在线展示页面

[主站-tts.5ixf.com](https://tts.5ixf.com)
[LastDream-lastdream.net](https://www.lastdream.net/plugin.php?id=LD:VOCALTTS)

-------------------------------

## 架构

```
浏览器 ──> 前端静态站（Vue 3，本仓库 src/）
              │  /v1/*（HMAC-SHA256 时间戳签名）
              ▼
         Go 后端（api/，OpenAI 风格接口）
              │  Gradio API
              ▼
         VoxCPM 推理服务（如 HuggingFace Space）
```

- 前端直接调用后端的 `/v1/models` 与 `/v1/audio/speech`，签名头由 `src/api/tts.js` 在浏览器内计算。
- 后端参考音频通过 `go:embed` 编译进二进制，运行时不依赖外部文件。
- 接口为 OpenAI 风格：`GET /v1/models`、`POST /v1/audio/speech`（`model` / `input` / `mode` / `voice_instruction`）。

## 快速开始

### (0) 拉取源码（github 和码云二选一）

```bash
# github（主要，速度较慢）
git clone https://github.com/0fengzi0/vocaltts-html.git

# 码云（备用，更新较慢）
git clone https://gitee.com/feng__zi/vocaltts-html.git
```

### (1) 安装前端依赖

```bash
yarn        # 或 npm install
```

### (2) 配置环境变量

复制 `.env.example` 为 `.env` 并填写：

```text
# 后端地址（前后端分离部署时填后端完整地址，同域反代可留空走相对路径）
VITE_API_BASE_URL=http://localhost:50080

# 与后端 apiSecret 保持一致的共享密钥（务必改掉默认值）
VITE_API_SECRET=CHANGE_ME_VOCALTTS_SHARED_SECRET
```

注意：

- `VITE_API_SECRET` 必须和 `api/main.go` 中的 `apiSecret` 保持一致，且两端同时使用随机强值替换默认值，否则接口可被任何人直接调用。
- 该密钥会随构建打进前端 JS，它只能防止接口被抓包后裸调，不防窃取；传输安全依赖 HTTPS。
- 修改 `.env` 后必须重新 `yarn build` 才会生效。

### (3) 开发 / 构建

```bash
yarn dev      # 本地开发（vite，端口 5173）
yarn build    # 构建到 dist/，纯静态文件，任意静态服务器即可托管
```

### (4) 构建后端

```bash
cd api
# 服务器为 Linux x86_64：
make linux-amd64        # 需 make 环境；或手动：
# GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o VoxCPM-TTS-API .
make build              # 本机平台
```

运行：`./VoxCPM-TTS-API`（默认端口 15674，可用环境变量 `PORT` 覆盖）。健康检查：`GET /healthz` 返回 `ok`。

## 部署（推荐：同域 Nginx 反代）

一个域名、一张证书即可，无需额外开放后端端口：

1. DNS 将域名（如 `tts.5ixf.com`）A 记录指向服务器。
2. `.env` 中 `VITE_API_BASE_URL` 留空，重新 `yarn build`，把 `dist/` 放到服务器（如 `/var/www/tts`）。
3. 后端二进制用 systemd（或 supervisor 等）守护运行，监听本机 `127.0.0.1:15674`，防火墙不对外开放该端口。
4. Nginx 配置要点：

```nginx
server {
    listen 443 ssl;
    server_name tts.5ixf.com;
    # ssl_certificate / ssl_certificate_key 略，可用 certbot --nginx 自动签发

    root /var/www/tts;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # history 模式路由必需
    }

    location /v1/ {
        proxy_pass http://127.0.0.1:15674;
        proxy_read_timeout 600s;            # TTS 推理 + 排队较慢
        proxy_send_timeout 600s;
        client_max_body_size 2m;
    }
}
```

5. 验证：浏览器打开站点，发音人列表正常加载即全链路通畅（直接浏览器访问 `/v1/models` 返回 401 属正常现象——接口要求签名头，只有 `/healthz` 可裸访问）。

前后端分离部署亦可：`VITE_API_BASE_URL` 填后端完整地址（如 `https://api.example.com`），后端 CORS 已放开 `*`，单独给后端配置 HTTPS 证书即可。

## 更新日志

2020.4.18

    开启 Gzip
    部分组件使用异步加载

2020.4.15

    重构前端项目
    新增移动端页面
    修改配置引入方式为环境变量
    UI 使用 vuetifyjs（一个谷歌 MD 风格的 UI 框架）

2020.2.18

    新增弹窗公告功能
    人机验证替换为手势验证码
    修改配置引入方式为 js 文件

2020.1.1

    修改配置方式为 json 文件配置

--------------

## 鸣谢

特别感谢 [JetBrains](https://www.jetbrains.com/?from=VOCALTTS) 为开源项目提供免费的 [WebStrom](https://www.jetbrains.com/?from=VOCALTTS) 等 IDE 的授权
[<img src="https://s1.ax1x.com/2020/08/13/az4yMF.png" width="200"/>](https://www.jetbrains.com/?from=VOCALTTS)
