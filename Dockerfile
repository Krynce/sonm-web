# Stage 1: build the web client
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /build

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ packages/
COPY patches/ patches/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter sonm-api build && \
  pnpm --filter sonm.js build && \
  pnpm --filter solid-livekit-components build && \
  pnpm --filter client exec lingui compile --typescript

# Placeholders replaced at container start by docker/inject.js
ENV VITE_API_URL=__VITE_API_URL__
ENV VITE_SUPPORT_URL=__VITE_SUPPORT_URL__
ENV VITE_SOURCE_URL=__VITE_SOURCE_URL__
ENV VITE_EMOJI_URL=__VITE_EMOJI_URL__
ENV VITE_RNNOISE_WORKLET_CDN_URL=__VITE_RNNOISE_WORKLET_CDN_URL__

ARG BASE_PATH=/
ARG PWA_SCOPE
ENV BASE_PATH=${BASE_PATH}
ENV PWA_SCOPE=${PWA_SCOPE}

RUN pnpm --filter client exec vite build

# Stage 2: static file server
FROM node:24-alpine

WORKDIR /app

COPY docker/package.json docker/inject.js ./
RUN npm install --omit=dev

COPY --from=builder /build/packages/client/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
