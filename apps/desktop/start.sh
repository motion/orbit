#!/bin/bash
./start-debug.sh &

echo $1

if [[ "$1" == "--build" ]]; then
  (build --watch) &
fi

npx nodemon \
  --quiet \
  --ignore src \
  --watch lib \
  --watch $(realpath node_modules/@mcro/black)/es6 \
  --watch $(realpath node_modules/@mcro/models)/es6 \
  --watch $(realpath node_modules/@mcro/debug)/es6 \
  --watch $(realpath node_modules/@mcro/dev)/es6 \
  --watch $(realpath node_modules/@mcro/all)/es6 \
  --watch $(realpath node_modules/@mcro/oracle)/lib \
  --watch $(realpath node_modules/@mcro/automagical)/es6 \
  --exec 'npx kill-port 3001 && \
    npx kill-port 9000 && \
    NODE_ENV=development DEBUG=api,api:* node --inspect=127.0.0.1:9000 lib/index.js'

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null
echo "done done"
