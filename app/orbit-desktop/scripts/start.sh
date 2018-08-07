#!/bin/bash

cd $(dirname $0)/..

npx nodemon \
  --verbose \
  --ignore src \
  --watch _ \
  --watch $(realpath node_modules/@mcro/models)/_ \
  --watch $(realpath node_modules/@mcro/services)/_ \
  --watch $(realpath node_modules/@mcro/debug) \
  --watch $(realpath node_modules/@mcro/dev)/_ \
  --watch $(realpath node_modules/@mcro/stores)/_ \
  --watch $(realpath node_modules/@mcro/oracle)/_ \
  --watch $(realpath node_modules/@mcro/automagical)/_ \
  --watch $(realpath node_modules/@mcro/decor-mobx)/_  \
  --watch $(realpath node_modules/@mcro/decor-react)/_  \
  --watch $(realpath node_modules/@mcro/decor-classes)/_  \
  --watch $(realpath node_modules/@mcro/decor)/_  \
  --watch $(realpath node_modules/@mcro/helpers)/_  \
  --watch $(realpath node_modules/@mcro/constants)/_  \
  --exec 'npx kill-port 3001 && \
    npx kill-port 9000 && \
    NODE_ENV=development node --inspect=127.0.0.1:9000 _/main.js'

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null

echo "bye orbit-desktop"
