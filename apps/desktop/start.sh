#!/bin/bash
./start-debug.sh &
if [[ "$1" == "--build" ]]; then
  (sleep 4 && build --watch) &
fi
npm run start-monitoring
