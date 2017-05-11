FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# install pnpm
# ENV NPM_CONFIG_LOGLEVEL error
# RUN npm install --global --depth 0 pnpm
# RUN pnpm config set network-concurrency 1
# RUN pnpm config set silent true
# add deps
# RUN apk add --update git

# import repo
RUN mkdir -p /repo
WORKDIR /repo

# bootstrap
COPY . /repo/
# RUN git init
# RUN pnpm install --production
RUN npm run bootstrap
# RUN apk del git

# run
WORKDIR /repo/apps/api
CMD npm run start-$ENV
EXPOSE 3000
