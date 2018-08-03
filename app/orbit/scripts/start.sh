#!/bin/bash

cd $(dirname $0)/..

# test prod app
if [ "$1" = "start-prod" ]; then
  DEBUG=api,crawler,crawler:* app/Orbit-darwin-x64/Orbit.app/Contents/MacOS/Orbit
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

