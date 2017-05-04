FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# add yarn
ENV PATH /root/.yarn/bin:$PATH
RUN apk update \
  && apk add curl bash binutils tar \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apk del curl tar binutils
RUN yarn config set no-progress true

# add git
RUN apk add --update git && \
  rm -rf /tmp/* /var/cache/apk/*

# import repo
RUN mkdir -p /repo
WORKDIR /repo
ADD . /repo

# bootstrap
RUN yarn install
# bugfix for lerna
RUN git init
RUN yarn run bootstrap
RUN yarn run build

WORKDIR /repo
CMD ./bin/start-api

EXPOSE 3000
