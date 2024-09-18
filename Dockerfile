
FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx tsc

EXPOSE 4000

CMD ["node", "dist/server.js"]
