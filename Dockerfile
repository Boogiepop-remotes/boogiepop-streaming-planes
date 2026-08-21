# syntax=docker/dockerfile:1
# Standalone Vite app → nginx ARM64 (ECS Fargate)
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG VITE_BASE=/streaming-planes/
ENV VITE_BASE=${VITE_BASE}
RUN npm run build

FROM nginx:1.27-alpine AS runner
ARG NGINX_BASE_PATH=streaming-planes
RUN apk add --no-cache wget
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s|__BASE_PATH__|${NGINX_BASE_PATH}|g" /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist ./

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
