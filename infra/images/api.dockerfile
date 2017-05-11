FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

ARG REGISTRY="https://registry.npmjs.org/"
RUN npm set registry $REGISTRY

RUN echo $REGISTRY

# import
RUN mkdir -p /repo
WORKDIR /repo

# add repo + this app
COPY ./.* ./package.json ./lerna.json ./shrinkwrap.yaml /repo/
COPY ./apps/api /repo/apps/api

# install
RUN npm install --production --silent
WORKDIR /repo/apps/api
RUN npm install --silent

# run
CMD npm run start-$ENV
EXPOSE 3000
