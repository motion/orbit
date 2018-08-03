#!/bin/bash

./scripts/start-debug.sh &

if [ "$1" = "start-pundle" ]; then
  pundle --watch.adapter chokidar --dev.port 3002 --dev.singlepage --dev.static ./public::/
  exit 0
fi

if [ "$1" = "start-prod" ]; then
  export NODE_ENV="production"
fi

debugPID=$!

# kill previous app, watch for app crashes
npx kill-port 3002
until npx mcro-build --port 3002; do
  echo "app crashed, restarting..." >&2
  sleep 1
done

wait
kill $debugPID 2> /dev/null
kill -9 $debugPID 2> /dev/null
echo "bye"
