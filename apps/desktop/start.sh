#!/bin/bash
./start-debug.sh &

echo $1

if [[ "$1" != "--no-build" ]]; then
  (build --watch) &
fi

npx nodemon \
  --quiet \
  --ignore src \
  --watch lib \
  --watch $(realpath node_modules/@mcro/black) \
  --watch $(realpath node_modules/@mcro/debug) \
  --watch $(realpath node_modules/@mcro/dev) \
  --watch $(realpath node_modules/@mcro/macros) \
  --watch $(realpath node_modules/@mcro/screen) \
  --watch ../../packages/automagical \
  --exec 'npx kill-port 3001 && npx kill-port 9000 && NODE_ENV=development DEBUG=api,api:* node --inspect=127.0.0.1:9000 lib/index.js'

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null
echo "done done"
