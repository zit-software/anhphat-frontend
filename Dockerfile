FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i --force

COPY . .

EXPOSE 3000

CMD ["npx", "serve", "-s", "build"]
