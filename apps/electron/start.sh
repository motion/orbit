#!/bin/bash

npx nodemon \
  --quiet \
  --watch _ \
  --watch $(realpath node_modules/@mcro/all)/_ \
  --watch $(realpath node_modules/@mcro/black)/_ \
  --watch $(realpath node_modules/@mcro/constants)/_  \
  --watch $(realpath node_modules/@mcro/reactron)/es6  \
  --watch $(realpath node_modules/@mcro/debug)  \
  --watch $(realpath node_modules/@mcro/automagical)/_  \
  --exec 'npx kill-port 9001 && NODE_ENV=development electron --inspect=9001 --remote-debugging-port=9002 _/start-app'
