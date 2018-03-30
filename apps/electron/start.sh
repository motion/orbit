#!/bin/bash

npx nodemon \
  --quiet \
  --watch lib \
  --watch $(realpath node_modules/@mcro/all)/_ \
  --watch $(realpath node_modules/@mcro/black)/es6 \
  --watch $(realpath node_modules/@mcro/constants)/es6  \
  --watch $(realpath node_modules/@mcro/reactron)/es6  \
  --watch $(realpath node_modules/@mcro/debug)/es6  \
  --watch $(realpath node_modules/@mcro/automagical)/es6  \
  --exec 'npx kill-port 9001 && NODE_ENV=development electron --inspect=9001 --remote-debugging-port=9002 lib/start-app'
