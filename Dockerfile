FROM ubuntu:focal AS builder

WORKDIR /app
COPY ./ /app

RUN apt update && DEBIAN_FRONTEND="noninteractive" apt -yy install nodejs npm python && npm install -g yarn gulp && yarn
RUN gulp build

FROM nginx:1.21.1-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
ADD ./nginx.conf /etc/nginx/conf.d/default.conf
