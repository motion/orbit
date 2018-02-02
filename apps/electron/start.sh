#!/bin/bash

function kill-electron() {
  kill -9 $(ps aux | grep 'node electron' | awk '{print $2}')
}

if [[ "$(lsof -i TCP:3001 | wc -c)" -ne 0 ]]; then
  kill-electron
  NODE_ENV=development electron ./lib/start-app
else
  echo "before electron run:"
  echo "$ run api"
fi