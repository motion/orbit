#!/bin/bash

cd $(dirname $0)/..

npx nodemon \
  --ignore src \
  --watch _ \
  --delay 2 \
  --exec 'npx kill-port 3001 && \
    npx kill-port 9000 && \
    NODE_ENV=development node --inspect=127.0.0.1:9000 ./_/main-development'

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null

echo "bye orbit-desktop"
