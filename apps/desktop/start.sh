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
npm run start-monitoring
echo "quitting app..."
kill -9 $(pidof start-debug.sh)
forever stopall
