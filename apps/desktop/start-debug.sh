#!/bin/bash
npx nodemon \
  --quiet \
  --watch $(realpath node_modules/@mcro/dev) \
  --watch $(realpath node_modules/@mcro/dev/node_modules/@mcro/debug-apps) \
  --exec 'npx kill-port 8001 && npx dev-apps' \
    ./node_modules/@mcro/dev &

nodemonPID=$!
wait
kill $nodemonPID 2> /dev/null
kill -9 $nodemonPID 2> /dev/null
echo "bye debugbrowser"
