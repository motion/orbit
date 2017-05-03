FROM nginx:stable-alpine

RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public

COPY apps/web/nginx.prod.conf /etc/nginx/nginx.conf
COPY apps/web/build /app/public
