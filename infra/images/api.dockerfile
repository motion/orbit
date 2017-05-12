FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# install deps
ENV PATH /root/.yarn/bin:$PATH
RUN apk update \
  && apk add curl bash binutils tar \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash
RUN yarn config set no-progress true
RUN apk add --update git

# import apps
RUN mkdir -p /repo
COPY ./.* ./package.json ./lerna.json ./shrinkwrap.yaml /repo/
COPY ./apps/api /repo/apps/api
COPY ./apps/couch /repo/apps/couch

# build
WORKDIR /repo
RUN yarn install --production
RUN git init
RUN npm run bootstrap
RUN apk del git

# run
WORKDIR /repo/apps/api
CMD npm run start-$ENV
EXPOSE 3000
