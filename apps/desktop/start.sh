#!/bin/bash

npx forever start \
  --killTree \
  -o /tmp/orbit-desktop-out.log \
  -e /tmp/orbit-desktop-err.log \
  -c /bin/bash \
    ./start-debug.sh > /dev/null &

./follow-logs.sh &
npm run start-monitoring
echo "quitting app..."
forever stopall
