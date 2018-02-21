#!/bin/bash
echo "starting..."
npx forever start \
  --minUptime 10000 \
  --killTree \
  -o /tmp/orbit-desktop-out.log \
  -e /tmp/orbit-desktop-err.log \
  -c /bin/bash \
    ./start-debug.sh > /dev/null &
./follow-logs.sh &
(sleep 3 && build --watch) &
npm run start-monitoring
echo "quitting debug..."
kill -9 $(pidof start-debug.sh)
echo "quitting processes..."
kill $(jobs -p)
forever stopall
