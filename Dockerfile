FROM node:22.14.0 AS source
WORKDIR /app/
COPY ./package.json ./package-lock.json .
RUN npm ci
COPY tsconfig.json ./
COPY ./src/ ./src/
CMD ["false"]


FROM source AS load
CMD ["npx", "tsx", "./src/scripts/load-cookies.ts", "/load/cookies.toml"]


FROM source AS migrate
COPY ./.gmrc .gmrc
COPY ./migrations/committed/ ./migrations/committed/
ENV CI=true
CMD ["npx", "graphile-migrate", "migrate"]


FROM source AS build
WORKDIR /app/
COPY ./svelte.config.js ./vite.config.ts ./
COPY ./static/ ./static/
ENV ENV=production
RUN npm run build


FROM node:22.14.0 AS release
WORKDIR /app/

ENV NODE_ENV=production
COPY ./package.json ./package-lock.json .
RUN npm ci
COPY --from=build /app/build/ ./

ENV PORT=3000
EXPOSE $PORT

CMD ["node", "index.js"]
