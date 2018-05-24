#!/bin/bash
./start-debug.sh &

npx kill-port 3002
until npx mcro-build --port 3002 ${@:1}; do
  echo "app crashed, restarting..." >&2
  sleep 1
done
