#!/bin/bash

# cd to root
cd $(dirname $0)/..

npx nodemon \
  --quiet \
  --watch $(realpath node_modules/@mcro/dev) \
  --watch $(realpath node_modules/@mcro/dev/node_modules/@mcro/debug-apps) \
  --exec 'npx kill-port 8001 && npx dev-apps' \
    ./node_modules/@mcro/dev

echo "bye orbit-dev"
