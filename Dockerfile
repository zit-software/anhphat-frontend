FROM node:18-alpine as base

FROM base as install

WORKDIR /app

COPY package*.json ./

RUN npm i --force

FROM install as build

WORKDIR /app

COPY . .

RUN npm run build

FROM build as deployment

WORKDIR /app

EXPOSE 3000

CMD ["npx", "serve", "-s", "build"]
