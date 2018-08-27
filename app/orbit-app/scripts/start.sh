#!/bin/bash

# cd to this package root
cd $(dirname $0)/..

if [ "$1" = "start-prod" ]; then
  echo "orbit-app production mode..."
  export NODE_ENV="production"
fi

npx kill-port 3002

if [ "$PUNDLE" = "true" ]; then
  echo "start w pundle"
  pundle --watch --dev.port 3002 --dev.singlepage --dev.static ./public::/ --cache.reset
else
  npx mcro-build --entry ./src/main --port 3002
fi

echo "bye orbit-app"
