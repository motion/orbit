FROM nginx:stable-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# run
RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public

# WORKDIR /repo

# copy to nginx
COPY ./apps/web/nginx/nginx.$ENV.conf /etc/nginx/nginx.conf
COPY ./apps/web/build /app/public
