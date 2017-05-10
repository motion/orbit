FROM redis

# args
ARG ENV="prod"
ENV ENV=${ENV}
