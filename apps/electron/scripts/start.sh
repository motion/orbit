#!/bin/bash

WEB_ON=$(lsof -i TCP:3002 | wc -c)
API_ON=$(lsof -i TCP:3001 | wc -c)

if [[ "$WEB_ON" -ne 0 && "$API_ON" -ne 0 ]]; then
  # parcel --version
  # NODE_ENV=development parcel --target=electron ./lib/start-app &
  # sleep 1
  DEBUG=server:*,server npx debug-apps &
  debugPID=$!
  ./scripts/restart.js &
  wait $! # wait for electron to quit
  kill $!
  kill $debugPID # then quit our debugger
else
  echo "before electron run:"
  echo "$ run app"
  echo "$ run desktop"
fi
