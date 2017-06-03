FROM nginx:stable-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# add node
RUN apk add --update nodejs

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

# config nginx
RUN mkdir -p /etc/nginx/ssl/
RUN mkdir -p /app/public
COPY ./apps/web/nginx/nginx.$ENV.conf /etc/nginx/nginx.conf
COPY ./apps/web/build /app/public

# import apps
RUN mkdir -p /repo
COPY ./.* ./package.json ./lerna.json /repo/
COPY ./apps/web /repo/apps/web
COPY ./apps/models /repo/apps/models

# build
WORKDIR /repo
RUN yarn install --production
RUN git init
RUN npm run bootstrap
RUN apk del git

# run
WORKDIR /repo/apps/web
CMD npm run start-$ENV
EXPOSE 3000
