FROM node:20 AS builder

WORKDIR /usr/src/app
COPY . .
RUN yarn set version 4.5.0
RUN yarn install
RUN yarn build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

RUN yarn set version 4.5.0

COPY --from=builder /usr/src/app/.yarn/ .yarn/
COPY --from=builder /usr/src/app/.yarnrc.yml .yarnrc.yml
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/.pnp.cjs .pnp.cjs
COPY --from=builder /usr/src/app/.pnp.loader.mjs .pnp.loader.mjs
COPY --from=builder /usr/src/app/.env .env

COPY --from=builder /usr/src/app/dist ./dist

RUN yarn workspaces focus --production


EXPOSE 4000

CMD ["yarn", "start:prod"]