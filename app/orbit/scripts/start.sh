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

./scripts/start-debug-browser.sh &
../orbit-electron/scripts/start.sh &
../orbit-desktop/scripts/start.sh &
../orbit-app/scripts/start.sh &

wait

kill %-
kill %-
kill %-
kill %-

echo "bye orbit"

