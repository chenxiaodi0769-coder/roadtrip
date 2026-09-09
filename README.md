# 中秋亲子游 17天路书（GitHub Pages 版）

纯静态单页路书，部署到 GitHub Pages，稳定不掉线（替代原 WorkBuddy 免费沙箱，后者空闲即被回收）。

## 文件说明
- `index.html` — 路书主页面（17 天行程 / 吃住玩 / 冷知识牌堆 / 备忘）
- `sw.js` — Service Worker 离线缓存（线上更新即时生效）
- `manifest.webmanifest` / `favicon.svg` / `apple-touch-icon.png` / `icon-192.png` — PWA 图标与清单
- `img/` — POI 缩略图目录（2026-09-08 源素材丢失，待补回；不影响可访问性）

## 部署
仓库名须为 `chenxiaodi0769-coder.github.io`（用户站点，域名即根 `/`），GitHub Pages 自动从 `main` 分支根目录发布。
访问地址：`https://chenxiaodi0769-coder.github.io/`

## 更新流程
1. 修改 `/tmp/roadtrip-deploy/index.html`（路书唯一源，含 d14aa5f 沙箱同源）
2. 同步本目录：`cp /tmp/roadtrip-deploy/index.html ./index.html` 并 bump `sw.js` 的 `CACHE` 版本号
3. `git add -A && git commit -m "更新" && git push`
4. GitHub Pages 自动构建（约 1 分钟），刷新即见
