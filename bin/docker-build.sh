#!/bin/bash

## build and push local docker images to docker hub
## usage: docker-build [app-short-name]
## example: docker-build api

APP=$1

# build
docker build -t motion/starter-$APP -f infra/images/$APP.dockerfile

# push
docker push motion/starter-$APP
