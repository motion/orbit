FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# install yarn
ENV PATH /root/.yarn/bin:$PATH
RUN apk update \
  && apk add curl bash binutils tar \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash

# config yarn
RUN yarn config set no-progress true
# bugfix for leveldown prebuild
RUN npm config set registry http://registry.npmjs.org/
# add deps
RUN apk add --update git

# import repo
RUN mkdir -p /repo
WORKDIR /repo
RUN apk del curl tar binutils
RUN rm -rf /tmp/* /var/cache/apk/*

# bootstrap
ADD ./package.json ./lerna.json ./.babelrc ./yarn.lock /repo/
RUN yarn install
RUN yarn cache clean

# build
ADD ./apps/api /repo/apps/api
# TODO: once we have actual using models
# ADD ./apps/models /repo/apps/models
RUN git init
RUN npm run bootstrap

RUN apk del git

# run
WORKDIR /repo/apps/api
CMD npm run start-$ENV
EXPOSE 3000
