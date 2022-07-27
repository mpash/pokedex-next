FROM mitchpash/pnpm AS deps
ARG FORTAWESOME_TOKEN
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml .npmr[c] ./

RUN pnpm install --frozen-lockfile

RUN rm -f .npmrc

FROM mitchpash/pnpm AS builder
WORKDIR /home/node/app
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM mitchpash/pnpm AS runner
WORKDIR /home/node/app

ENV NODE_ENV production

COPY --from=builder /home/node/app/next.config.js ./
COPY --from=builder /home/node/app/public ./public
COPY --from=builder /home/node/app/package.json ./package.json

COPY --from=builder --chown=node:node /home/node/app/.next/standalone ./
COPY --from=builder --chown=node:node /home/node/app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]