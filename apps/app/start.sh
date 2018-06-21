#!/bin/bash
./start-debug.sh &
debugPID=$!

npx kill-port 3002
until npx mcro-build --port 3002 ${@:1}; do
  echo "app crashed, restarting..." >&2
  sleep 1
done

wait
kill $debugPID 2> /dev/null
kill -9 $debugPID 2> /dev/null
echo "bye"
