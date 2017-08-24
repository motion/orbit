FROM mhart/alpine-node:8

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

COPY . /repo

# build
WORKDIR /repo

# put in .dockerignore if you want to run bin/bootstrap
# RUN bin/bootstrap
# */node_modules
# */*/node_modules

# run
WORKDIR /repo/apps/api
CMD npm run start-$ENV
EXPOSE 3000
EXPOSE 5858
