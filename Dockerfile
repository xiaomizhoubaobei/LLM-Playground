# 基础镜像
FROM node:lts AS base

# 使用官方脚本安装yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# 安装依赖
FROM base AS deps
WORKDIR /app

# 复制依赖文件
COPY package.json yarn.lock ./

# 使用 yarn 安装依赖
RUN yarn install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app

# 设置构建所需的环境变量
ENV AI_302_API_KEY=placeholder_key
ENV AI_302_API_URL=https://api.302.ai
ENV NEXT_PUBLIC_AI_302_API_UPLOAD_URL=https://dash-api.302.ai/gpt/api/upload/gpt/image

# 复制依赖和源代码
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 使用 yarn 构建应用程序
RUN yarn build

# 生产环境镜像
FROM base AS runner
WORKDIR /app

# 创建非root用户
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# 复制公共资源
COPY --from=builder /app/public ./public

# 设置预渲染缓存权限
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000

# 启动命令
CMD HOSTNAME="0.0.0.0" yarn start