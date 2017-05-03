FROM nginx:stable-alpine

RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public

COPY nginx.prod.conf /etc/nginx/nginx.conf
COPY public /app/build
