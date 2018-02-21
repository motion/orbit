#!/bin/bash
./start-debug.sh &
if [[ "$1" == "--build" ]]; then
  (sleep 4 && build --watch) &
fi

npx nodemon \
  --ignore src \
  --watch lib \
  --watch $(realpath node_modules/@mcro/black) \
  --watch $(realpath node_modules/@mcro/debug) \
  --watch $(realpath node_modules/@mcro/dev) \
  --watch $(realpath node_modules/@mcro/macros) \
  --watch $(realpath node_modules/@mcro/oracle) \
  --watch $(realpath node_modules/@mcro/screen) \
  --watch $(realpath node_modules/@mcro/search) \
  --exec 'npm run start-app'

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null &
echo "done done"
