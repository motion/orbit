#!/bin/bash

# if [[ "$(lsof -i TCP:3001 | wc -c)" -ne 0 ]]; then
  # kill old process first
  npx kill-port 3002
  parcel -p 3002 ./public/index.html
# else
#   echo "before web run:"
#   echo "$ run api"
# fi