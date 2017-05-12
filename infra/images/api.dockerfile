FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}
ARG REGISTRY="local"
ENV ENV=${ENV}

RUN npm i -g pnpm --silent

RUN netstat -nr | grep '^0\.0\.0\.0' | awk '{print $2}' > /host_tmp

RUN echo $REGISTRY

RUN pnpm set registry "http://$(cat /host_tmp):4873"
RUN echo $(pnpm get registry)

RUN pnpm view @jot/models

# import
RUN mkdir -p /repo
WORKDIR /repo

# add repo + this app
COPY ./.* ./package.json ./lerna.json ./shrinkwrap.yaml /repo/
COPY ./apps/api /repo/apps/api

# install
# RUN pnpm install --production --silent
WORKDIR /repo/apps/api
RUN pnpm install --silent

# run
CMD npm run start-$ENV
EXPOSE 3000
