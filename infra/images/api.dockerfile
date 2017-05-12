FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

RUN npm set progress false

# import apps
RUN mkdir -p /repo
WORKDIR /repo
COPY ./.* ./package.json ./lerna.json ./shrinkwrap.yaml /repo/
RUN npm install --production --quiet
COPY ./apps/api /repo/apps/api
COPY ./apps/couch /repo/apps/couch

# run
WORKDIR /repo/apps/api
CMD npm run start-$ENV
EXPOSE 3000
