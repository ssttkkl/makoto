### build-stage ###
FROM node:18 AS build-stage

WORKDIR /home/node/app

COPY package.json yarn.lock ./

RUN yarn global add glob rimraf && yarn install

COPY . .

RUN yarn run build


### PROD环境 ###
FROM nginx:latest

COPY --from=build-stage /home/node/app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf