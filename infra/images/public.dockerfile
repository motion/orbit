FROM nginx:stable-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# run
RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public

# mirror volume mounts in docker-compose
# otherwise it fails when not mounted on build
# ADD ./apps/public /repo/apps/public
# ADD ./apps/web /repo/apps/web

WORKDIR /repo

# copy to nginx
ADD ./apps/public/nginx.$ENV.conf /etc/nginx/nginx.conf
ADD ./apps/web/build /app/public
