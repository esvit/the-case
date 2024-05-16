FROM node:20

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY ./*.ts ./
COPY ./apps/ ./apps
COPY ./domain/ ./domain
COPY ./helpers/ ./helpers
COPY ./infra/ ./infra
COPY ./migrations/ ./migrations
COPY ./env.yaml.dist ./env.yaml
COPY ./ecosystem.config.js ./ecosystem.config.js

RUN npm i -g pm2 && npm ci && npm run build

CMD pm2-runtime --json ecosystem.config.js

EXPOSE 5000
