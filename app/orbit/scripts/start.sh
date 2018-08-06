#!/bin/bash

cd $(dirname $0)/..

FLAG=""

# test prod app
if [ "$1" = "start-prod" ]; then
  FLAG="start-prod"
  echo "starting app in prod... $FLAG"
fi

browserPID=$!
./scripts/start-debug-browser.sh &
electronPID=$!
../orbit-electron/scripts/start.sh &
desktopPID=$!
../orbit-desktop/scripts/start.sh &
appPID=$!
../orbit-app/scripts/start.sh $FLAG &
lastPID=$!

wait

kill -9 $browserPID 2> /dev/null
kill -9 $electronPID 2> /dev/null
kill -9 $desktopPID 2> /dev/null
kill -9 $appPID 2> /dev/null
kill -9 $lastPID 2> /dev/null

echo "bye orbit"

