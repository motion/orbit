FROM nginx:stable-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# run
RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public

# copy to nginx
ADD ./apps/web/nginx/nginx.$ENV.conf /etc/nginx/nginx.conf
ADD ./apps/web/build /app/public
