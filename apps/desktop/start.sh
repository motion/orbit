#!/bin/bash
./start-debug.sh &
if [[ "$1" == "--build" ]]; then
  (sleep 4 && build --watch) &
fi

npx nodemon --delay 200ms --ignore src \
  --watch $(realpath node_modules/@mcro/black) \
  --watch $(realpath node_modules/@mcro/crawler) \
  --watch $(realpath node_modules/@mcro/debug) \
  --watch $(realpath node_modules/@mcro/dev) \
  --watch $(realpath node_modules/@mcro/macros) \
  --watch $(realpath node_modules/@mcro/oracle) \
  --watch $(realpath node_modules/@mcro/screen) \
  --watch $(realpath node_modules/@mcro/search) \
  --exec 'npm run start-app'

trap "killall background" EXIT
