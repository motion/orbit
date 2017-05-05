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
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apk del curl tar binutils

# config yarn
RUN yarn config set no-progress true

# bugfix for leveldown prebuild
RUN npm config set registry http://registry.npmjs.org/

# add deps
# RUN apk add --update git

# cleanup
# RUN rm -rf /tmp/* /var/cache/apk/*

# import repo
RUN mkdir -p /repo
WORKDIR /repo
ADD . /repo

# bootstrap
# RUN yarn install --production
# RUN yarn cache clean
# RUN git init
# RUN npm run bootstrap

# remove deps
# RUN apk del git

WORKDIR /repo/apps/api
CMD npm run start-$ENV

EXPOSE 3000
