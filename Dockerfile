### build-stage ###
FROM node:18 AS build-stage

COPY package*.json ./

RUN yarn global add glob rimraf && yarn install

COPY . .

RUN yarn run build

