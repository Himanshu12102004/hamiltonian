#NGINX
FROM nginx:1.25.4-alpine as build
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*

RUN apk add --no-cache tzdata
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./dist /usr/share/nginx/html
EXPOSE 80
