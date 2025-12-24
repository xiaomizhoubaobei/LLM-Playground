# 基础镜像
FROM node:20.14-alpine AS base

# 仅在需要时安装依赖
FROM base AS deps
# 安装兼容性库
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 根据包管理器安装依赖
RUN \
    if [ -f yarn.lock ]; then \
        corepack enable && \
        yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
        npm config set registry https://registry.npmmirror.com && \
        npm ci; \
    elif [ -f pnpm-lock.yaml ]; then \
        corepack enable pnpm && \
        pnpm config set registry https://registry.npmmirror.com && \
        pnpm i --frozen-lockfile; \
    else \
        echo "未找到锁定文件。" && exit 1; \
    fi

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖和源代码
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用程序
RUN corepack enable pnpm && pnpm run build;

# 生产环境镜像
FROM base AS runner
WORKDIR /app

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

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
CMD HOSTNAME="0.0.0.0" node server.js