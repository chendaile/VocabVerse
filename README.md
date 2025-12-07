# 技术栈（英语单词记忆 App）
![img](.idea/Gemini_Generated_Image_kvvpjfkvvpjfkvvp.png)
## 前端（Web + App UI）
- **React + Vite + TypeScript**
- **TailwindCSS**：移动端优先样式
- **状态管理**：Zustand / Redux（二选一）
- **HTTP**：自封装 Fetch 或 Axios

## 移动端打包
- **Capacitor**
  - 打包为 Android / iOS App
  - 原生能力：Camera / Filesystem / Storage 等插件
  - 与前端共用一套代码

## 后端（API 服务）
- **NestJS（TypeScript 框架）**
  - 模块化：`auth / user / words / progress / review`
  - 内置验证、配置、依赖注入等

## 鉴权
- **微信 OAuth 登录**
  - 后端处理微信授权回调，获取 `openid`
  - 使用 **JWT** 发放访问 Token

## 数据库层
- **PostgreSQL**（关系型）
- **Prisma ORM**
  - `User / Word / Progress` 等模型
  - 自动生成 TS 类型 & 数据迁移

## 前后端共享
- `share/` 目录：存放通用 TS 类型
  - 如：`User`, `Word`, `Progress` 接口

## 项目结构（Monorepo）

```bash
my-project/
├─ frontend/      # React + Vite + Tailwind + Capacitor
├─ android/       # Android 原生工程（Capacitor）
├─ ios/           # iOS 原生工程（可选）
├─ backend/       # NestJS + Prisma + PostgreSQL
├─ share/         # 前后端共享 TypeScript 类型
└─ README.md
