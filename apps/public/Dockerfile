FROM nginx:stable-alpine

RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public

COPY apps/public/nginx.dev.conf /etc/nginx/nginx.conf

ADD apps/web/build /app/public
