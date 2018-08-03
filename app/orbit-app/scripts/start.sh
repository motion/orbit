#!/bin/bash

# cd to this package root
cd $(dirname $0)/..

if [ "$1" = "start-pundle" ]; then
  pundle --watch.adapter chokidar --dev.port 3002 --dev.singlepage --dev.static ./public::/
  exit 0
fi

if [ "$1" = "start-prod" ]; then
  export NODE_ENV="production"
fi

npx kill-port 3002
npx mcro-build --port 3002

echo "bye orbit-app"
