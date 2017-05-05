FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# install yarn
RUN apk update
RUN apk add curl bash binutils tar
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# config yarn
ENV PATH /root/.yarn/bin:$PATH
RUN yarn config set no-progress true

# add git
RUN apk add --update git

# cleanup
RUN rm -rf /tmp/* /var/cache/apk/*

# import repo
RUN mkdir -p /repo
WORKDIR /repo
ADD . /repo

# bootstrap
RUN yarn install --production
RUN git init
RUN npm run bootstrap

WORKDIR /repo/apps/api
CMD npm run start-$ENV

EXPOSE 3000
