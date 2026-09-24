FROM node:24-bookworm-slim AS build

WORKDIR /workspace

# This is a pnpm monorepo, so install from the repository root to make the
# CloudScale app's workspace dependencies resolvable.
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile

# vite.config.ts requires PORT and BASE_PATH during both builds and runtime.
ENV PORT=80 \
    BASE_PATH=/
RUN pnpm --filter @workspace/cloudscale run build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/artifacts/cloudscale/dist/public/ /usr/share/nginx/html/

EXPOSE 80
