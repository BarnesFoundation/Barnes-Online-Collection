# Multi-stage build for the Barnes collection website (react-scripts 3.0.1, Node 12/14 era),
# served in production by `node server/index.js`. Data layer swapped ES -> Postgres V2.
# ---- build stage: match the app's .nvmrc (Node 12.22) so node-sass 4.12 gets a prebuilt binary ----
FROM node:12 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
# npm 6 (bundled with node 12): no --legacy-peer-deps needed; it does not enforce peer deps
RUN npm install --no-audit --no-fund
COPY . .
# Client build-time config (baked into the bundle): images from CloudFront, NetX OFF (read from the
# materialized store — no per-request NetX). CI=false so CRA warnings don't fail the build.
ENV CI=false
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV REACT_APP_IMAGE_BASE_URL=https://d2r83x5xt28klo.cloudfront.net
ENV REACT_APP_IMAGES_PREFIX=
ENV REACT_APP_NETX_ENABLED=false
RUN npm run build

# ---- runtime stage ----
# Copy the whole built tree: server/app.js requires files from src/ and scripts/ at runtime
# (artObjectTitles.json, src/shared/config, src/shared/utils, scripts/build-search-assets).
FROM node:18-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server/index.js"]
