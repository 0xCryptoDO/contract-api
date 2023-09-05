FROM node:17

WORKDIR /home/contract-api

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start:prod"]