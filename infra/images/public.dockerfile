FROM nginx:stable-alpine

RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public

# mirror volume mounts in docker-compose
# otherwise it fails when not mounted on build
ADD ./apps/public /repo/apps/public
ADD ./apps/web /repo/apps/web

WORKDIR /repo

ADD ./apps/public/nginx.dev.conf /etc/nginx/nginx.conf

ADD ./apps/web/build /app/public
