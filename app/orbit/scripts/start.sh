#!/bin/bash

cd $(dirname $0)/..
FLAGS=$@

# start repl debugger
if [[ "$FLAGS" =~ "--ignore-repl" ]]; then
  echo "ignoring repl"
else
  (cd ../orbit-repl && npm start &)
fi

# start webpack-dev-server
if [[ "$FLAGS" =~ "--ignore-app" ]]; then
  echo "ignoring app"
else
  if [ "$1" = "start-prod" ]; then
    ../orbit-app/scripts/start.sh start-prod &
  else
    ../orbit-app/scripts/start.sh &
  fi
fi

if [[ "$FLAGS" =~ "--disable-watch" ]]; then
  echo "not watching backend for changes..."
  ./scripts/run-orbit.sh
else
  if [[ "$FLAGS" =~ "--ignore-electron" ]]; then
    export IGNORE_ELECTRON="true"
  fi

  export PROCESS_NAME="electron"
  export STACK_FILTER="orbit-electron"
  # start app
  npx nodemon \
    --watch _ \
    --watch $(realpath node_modules/@mcro/orbit-electron)/_ \
    --watch $(realpath node_modules/@mcro/orbit-desktop)/_ \
    --delay 0.5 \
    --exec './scripts/run-orbit.sh'
fi

echo "bye orbit!"

