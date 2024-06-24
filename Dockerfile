FROM node:20.12.2-buster-slim as build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . ./

RUN pnpm run build
RUN pnpm prune --prod


FROM node:20.12.2-buster-slim as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

COPY --from=build /usr/src/app/dist ./dist

CMD [ "npm", "run", "start:prod"]
