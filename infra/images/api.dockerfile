FROM node:7-alpine

# args
ARG ENV="prod"
ENV ENV=${ENV}

# import apps
RUN mkdir -p /repo
WORKDIR /repo
COPY ./.* ./package.json ./lerna.json ./shrinkwrap.yaml /repo/
RUN npm install --production
COPY ./apps/api /repo/apps/api

# run
WORKDIR /repo/apps/api
CMD npm run start-$ENV
EXPOSE 3000
