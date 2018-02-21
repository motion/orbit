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
  --exec 'npm run start-app'

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null
echo "done done"
