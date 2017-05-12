FROM nginx:stable-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# add node
RUN apk app --update nodejs

# run
RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public

# copy to nginx
COPY ./apps/web/nginx/nginx.$ENV.conf /etc/nginx/nginx.conf
COPY ./apps/web/build /app/public

# import apps
RUN mkdir -p /repo
WORKDIR /repo
COPY ./.* ./package.json ./lerna.json ./shrinkwrap.yaml /repo/
COPY ./apps/web /repo/apps/web
COPY ./apps/models /repo/apps/models

# run
WORKDIR /repo/apps/web
CMD npm run start-$ENV
EXPOSE 3001
