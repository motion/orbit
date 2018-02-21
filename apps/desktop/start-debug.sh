#!/bin/bash
npx nodemon \
  --quiet \
  --watch $(realpath node_modules/@mcro/dev) \
  --watch $(realpath node_modules/@mcro/dev/node_modules/@mcro/debug-apps) \
  --exec 'npm run start-debug' \
    ./node_modules/@mcro/dev &

nodemonPID=$!
wait
kill $nodemonPID > /dev/null
kill -9 $nodemonPID > /dev/null
echo "bye debugbrowser"
