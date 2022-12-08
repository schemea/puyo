FROM node:18-alpine as builder

WORKDIR /build

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY webpack.config.ts .
COPY tsconfig.json .
COPY src src

RUN npm run build

FROM nginx:1.23.2-alpine
COPY --from=builder /build/dist /app
