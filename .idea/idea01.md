# 背单词后端 API 框架草案

## 1. 概览
- 目标：按计划推送新词、按记忆状态动态复习，不固定复习列表，只用 `wordId` 关联。
- 数据拆分：词典库只读，用户库只存用户/计划/进度/日志，耦合点是 `wordId`。
- 模块划分：`auth`(JWT) · `words`(词典只读) · `user-plans`(计划管理) · `user-words`(分发/复习/记录) · `review-strategy`(算法可插拔)。

## 2. 鉴权（开发阶段）
- 方案：简易 JWT（HMAC），登录/注册接口签发 `{ userId }`，前端带 `Authorization: Bearer <token>`。
- Guard：全局 Guard 校验 JWT，将 `req.user = { id }` 注入，控制器无需显式传 userId。
- 开发便捷：保留可选 `DEFAULT_USER_ID` 回落（用于本地调试时未带 token）。

## 3. 数据模型
### 3.1 词典库（word-db）
- 表：`stardict`（已存在），字段含 `id`, `word`, `phonetic`, `definition`, `translation`, `frq`, `collins`, `tag` 等。
- Tag 建议：值暂时为字符串，分隔符一致为空格用包含查询。

### 3.2 用户库（user-db）
- `User`: `id (cuid)`，`openid?/externalId`，`createdAt`。
- `UserPlan`: `id`, `userId`, `tag (enum: cet4|cet6|gre|ielts|toefl|ky)`, `dailyNewTarget`, `dailyReviewTarget`, `createdAt`, `updatedAt`。
- `UserWord`: `id`, `userId`, `planId`, `wordId (int 对应 stardict.id)`, `status (NEW|LEARNING|REVIEW|MASTERED)`, `lastResult (GOOD|HARD|FAIL?)`, `nextReviewAt`, `reviewedTimes`, `correct`, `wrong`, `createdAt`, `updatedAt`, `@@unique([userId, wordId])`。
- 复习池来源：`UserWord` 中 `nextReviewAt <= now` 的记录，按规则排序。

## 4. 模块职责
- `auth`：登录/注册，签发 JWT；Guard 解析 token。
- `words`：只读词典（详情、搜索、随机/按 tag 取词）。
- `user-plans`：CRUD 计划，限定 tag 枚举，只改目标数字，不改 tag。
- `user-words`：分发新词、拉取复习队列、提交结果；桥接 `UserPrismaService` + `WordPrismaService`。
- `review-strategy`：算法接口与实现（默认简单间隔，可替换 SM-2 等）。

## 5. 路由草案（鉴权后使用当前用户）
- Auth
  - `POST /auth/login`（或 `/auth/dev-login`）：返回 `{ token, userId }`，开发可传自定义 userId。
- 词典
  - `GET /words/:id`：词详情。
  - `GET /words/search?q=&tag=`：搜索；tag 使用枚举短码。
  - `GET /words/random?tag=&limit=`：为新词分发提供候选。
- 计划
  - `POST /me/plans`：创建 `{ tag, dailyNewTarget, dailyReviewTarget }`。
  - `GET /me/plans`：列出。
  - `PATCH /me/plans/:planId`：部分更新 `{ dailyNewTarget?, dailyReviewTarget? }`（不改 tag）。
  - `DELETE /me/plans/:planId`：删除计划（需定义是否级联删除进度）。
- 新词分发
  - `POST /me/plans/:planId/enqueue-new`：按 plan.tag 在词典中选用户未学词，取 `count`（默认 dailyNewTarget），写入 `UserWord` 为 `NEW`。
  - `GET /me/plans/:planId/new`：返回待学新词列表。
- 复习队列（动态）
  - `GET /me/plans/:planId/review-due?limit=`：`nextReviewAt <= now` 的记录，按优先级排序返回 `wordId` 列表。
- 学习/复习提交
  - `PATCH /me/words/:wordId`：`{ result: 'GOOD'|'HARD'|'FAIL', durationMs? }`，调用策略更新 `status/nextReviewAt`，写 log。

## 6. 复习排序 & 策略
- 队列排序：`ORDER BY nextReviewAt ASC`（超期最长优先），可再加 `status`/历史正确率做次序。
- 算法解耦：定义接口 `calc(history, grade, now) => { nextReviewAt, status, interval? }`，默认 `GOOD +1d`, `HARD +12h`, `FAIL +1h`；未来可插拔 SM-2 等。

## 7. 典型流程
1) 登录获取 JWT；请求头带 `Authorization: Bearer <token>`。
2) 创建计划（如 cet4，日新 20，复习 60）。
3) `enqueue-new` 抽取未学词写入 `UserWord`(NEW)。
4) 前端从 `new` 拉 `wordId`，调 `/words/:id` 展示，提交结果到 `/me/words/:wordId`。
5) 复习时调用 `review-due` 取待复习 `wordId`，同样提交结果更新复习时间。

## 8. 待补充/实现顺序
- 更新 `prisma/user/schema.prisma`：Plan/UserWord/UserWordLog + tag 枚举；生成 `UserPrismaService` 模块。
- （可选）将词典 tag 改为 `String[]`，优化包含查询。
- 编写 `review-strategy` 接口与默认实现；在 `user-words.service` 注入。
- 写 auth Guard + dev 登录；控制器读取 `req.user.id`。
- 补路由与 DTO 校验；写基本 e2e 流程测试（新词分发→学习→复习队列）。
