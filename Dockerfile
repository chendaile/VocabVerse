FROM node:20-bookworm

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci

# 复制源代码并构建
COPY . .
# 先生成 Prisma Client，再编译 Nest
# Prisma generate 需要一个非空的 DATABASE_URL，这里提供占位，运行时会被实际环境变量覆盖
ARG DATABASE_URL=postgresql://user:pass@localhost:5432/db
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate && npm run build

ENV NODE_ENV=production

# 直接启动 NestJS（默认编译到 dist/src/main.js）
CMD ["node", "dist/src/main.js"]
