#!/bin/bash

cd $(dirname $0)/..

# start repl debugger
./scripts/start-debug-browser.sh &

# start webpack-dev-server
if [ "$1" = "start-prod" ]; then
  ../orbit-app/scripts/start.sh start-prod &
else
  ../orbit-app/scripts/start.sh &
fi

# start app
npx nodemon \
  --watch _ \
  --delay 1 \
  --exec 'npx kill-port 9001 && NODE_ENV=development electron --inspect=9001 --remote-debugging-port=9002 _/main.js'

echo "bye orbit-electron"


wait

