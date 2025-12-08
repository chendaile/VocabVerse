# 技术栈（英语单词记忆 App）
![img](.idea/Gemini_Generated_Image_kvvpjfkvvpjfkvvp.png)

## 前端（Web + App UI）
- React + Vite + TypeScript
- TailwindCSS（移动端优先）
- 状态管理：Zustand
- HTTP：Axios 封装
- 类型定义：`frontend/src/types.ts`

## 移动端打包
- Capacitor：打包 Android / iOS，共用前端代码
- 原生能力：Camera / Filesystem / Storage 等插件

## 后端（API 服务）
- NestJS 11 + TypeScript
- Prisma + PostgreSQL（模型在 `backend/prisma/schema.prisma`）
- 示例模块：`words`，已提供 `/words/levels`、`/words/levels/:id/words`、`/words/progress`、`/words/image`
- 类型定义：`backend/src/types.ts`

## 鉴权
- 设计为微信 OAuth，后端获取 `openid`，下发 JWT（待实现）

## 开发启动
- 后端：`cd backend && npm install && npm run start:dev`（如需数据库再配 `.env`、`npx prisma generate`）
- 前端：`cd frontend && npm install && npm run dev`
- 代理：前端将 `/api` 代理到 `http://localhost:3000`（见 `frontend/vite.config.ts`）

## 项目结构
```bash
my-project/
├─ landing/       # React + Vite 的下载/介绍站点
├─ frontend/      # React + Vite + Tailwind + Capacitor
├─ android/       # Android 原生工程（Capacitor）
├─ ios/           # iOS 原生工程（可选）
├─ backend/       # NestJS + Prisma + PostgreSQL
└─ README.md
```
