#!/bin/bash

cd $(dirname $0)/..

# kill old instances
npx kill-port 9001 &
npx kill-port 9002 &
npx kill-port 9003 &
wait
export NODE_ENV=development
export ELECTRON_DISABLE_SECURITY_WARNINGS=true


# in development mode we set FIRST_RUN so it auto-runs
# in prod we have a separate script, see build-orbit/stage-app/index.js
export FIRST_RUN=true
export CLI_PATH=.
export LOG_LEVEL=7

if [[ "$DISABLE_GPU" =~ "true" ]]; then
  echo "⚠️ ⚠️ ⚠️ disabling gpu to prevent white bg bugs ⚠️ ⚠️ ⚠️"
  npx electron --disable-gpu --async-stack-traces --inspect=9001 --remote-debugging-port=9002 ./_/main.js
else
  npx electron --async-stack-traces --inspect=9001 --remote-debugging-port=9002 ./_/main.js
fi

``
