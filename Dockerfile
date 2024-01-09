FROM oven/bun as base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS development
ENTRYPOINT [ "bun", "dev" ]

FROM base AS production
ENV NODE_ENV=production
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENTRYPOINT [ "bun", "prod" ]

FROM base AS testing
ENV NODE_ENV=production
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN bun test

USER bun
EXPOSE 3000
