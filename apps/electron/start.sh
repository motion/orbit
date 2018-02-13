#!/bin/bash

function kill-electron() {
  electron_pid=$(ps aux | grep 'node electron' | awk '{print $2}')
  echo "electron pid: $electron_pid"
  kill -9 "$electron_pid"
}

WEB_ON=$(lsof -i TCP:3002 | wc -c)
API_ON=$(lsof -i TCP:3001 | wc -c)

if [[ "$WEB_ON" -ne 0 && "$API_ON" -ne 0 ]]; then
  kill-electron
  NODE_ENV=development electron --inspect=5959 ./lib/start-app
  wait
else
  echo "before electron run:"
  echo "$ run app"
  echo "$ run desktop"
fi
