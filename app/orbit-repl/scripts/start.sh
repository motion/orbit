#!/bin/bash

# cd to root
cd $(dirname $0)/..

npx nodemon \
  --watch _ \
  --watch $(realpath node_modules/@mcro/debug-apps) \
  --exec 'npx kill-port 8001 && npx orbit-repl'

echo "bye orbit-repl"
