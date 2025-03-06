# 构建阶段
FROM oven/bun:1 AS builder
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖并构建
RUN bun install
RUN bun run build

# 运行阶段
FROM oven/bun:1-slim AS runner
WORKDIR /app

# 环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建系统用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置权限
RUN chown -R nextjs:nodejs /app

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 启动命令
CMD ["bun", "server.js"]