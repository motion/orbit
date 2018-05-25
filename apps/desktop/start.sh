#!/bin/bash
echo $1

if [[ "$1" == "--build" ]]; then
  (build --watch) &
fi

npx nodemon \
  --quiet \
  --ignore src \
  --watch _ \
  --watch $(realpath node_modules/@mcro/black)/_ \
  --watch $(realpath node_modules/@mcro/models)/_ \
  --watch $(realpath node_modules/@mcro/debug) \
  --watch $(realpath node_modules/@mcro/dev)/_ \
  --watch $(realpath node_modules/@mcro/all)/_ \
  --watch $(realpath node_modules/@mcro/oracle)/lib \
  --watch $(realpath node_modules/@mcro/automagical)/_ \
  --exec 'npx kill-port 3001 && \
    npx kill-port 9000 && \
    NODE_ENV=development node -r esm --inspect=127.0.0.1:9000 _/index.js'

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null
echo "done done"
