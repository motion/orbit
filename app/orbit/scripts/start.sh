#!/bin/bash

cd $(dirname $0)/..

# test prod app
if [ "$1" = "start-prod" ]; then
  ./scripts/start-debug-browser.sh &
  echo "starting app in prod..."
  NODE_ENV=production ../build-orbit/node_modules/.bin/electron --inspect=9001 --remote-debugging-port=9002 ./_/main
  wait
  kill %-
  exit 0
fi

browserPID=$!
./scripts/start-debug-browser.sh &
electronPID=$!
../orbit-electron/scripts/start.sh &
desktopPID=$!
../orbit-desktop/scripts/start.sh &
appPID=$!
../orbit-app/scripts/start.sh &
lastPID=$!

wait

kill -9 $browserPID 2> /dev/null
kill -9 $electronPID 2> /dev/null
kill -9 $desktopPID 2> /dev/null
kill -9 $appPID 2> /dev/null
kill -9 $lastPID 2> /dev/null

echo "bye orbit"

