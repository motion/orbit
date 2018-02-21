#!/bin/bash
npx nodemon \
  --quiet \
  --watch $(realpath node_modules/@mcro/dev) \
  --watch $(realpath node_modules/@mcro/dev/node_modules/@mcro/debug-apps) \
  --exec 'npm run start-debug' \
    ./node_modules/@mcro/dev &

wait
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null &
echo "bye debugbrowser"
