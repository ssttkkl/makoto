### build-stage ###
FROM node:18 AS build-stage

WORKDIR /home/node/app

COPY package.json yarn.lock ./

RUN yarn global add glob rimraf && yarn install

COPY . .

RUN yarn build


### PROD环境 ###
FROM node:18-slim

WORKDIR /home/node/app

ENV PORT=12345
EXPOSE 12345

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json yarn.lock ./

RUN yarn install --only=production

COPY . .

COPY --from=build-stage /home/node/app/dist ./dist

CMD ["node", "dist/index"]
