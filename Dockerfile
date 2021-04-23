# Install dependencies only when needed
FROM node:14.16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Generate Prisma exports
FROM node:14.16-alpine AS prisma
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json prisma ./
RUN yarn prisma generate

# Rebuild the source code only when needed
FROM node:14.16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma

ENV LOCAL_CACHE=true

RUN yarn clean
RUN yarn build

# Production image, copy all the files and run app
FROM node:14.16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S auth -u 1001

RUN chown -R auth:nodejs /app

COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER auth

EXPOSE 5000

CMD ["yarn", "start"]