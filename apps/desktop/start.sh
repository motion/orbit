#!/bin/bash
./start-debug.sh &
debugPID=$!
if [[ "$1" == "--build" ]]; then
  (sleep 4 && build --watch) &
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
  --exec 'npm run start-app'

echo "killing debug browser $debugPID"
kill -9 $debugPID
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null
echo "done done"
