#!/bin/bash

npx nodemon \
  --quiet \
  --ignore src \
  --watch lib \
  --watch $(realpath node_modules/@mcro/all) \
  --watch $(realpath node_modules/@mcro/black) \
  --watch $(realpath node_modules/@mcro/constants)  \
  --watch $(realpath node_modules/@mcro/reactron)  \
  --watch $(realpath node_modules/@mcro/debug)  \
  --watch $(realpath node_modules/@mcro/macros) \
  --exec 'npx wait-port 3002 && npx wait-port 3001 && npx kill-port 9001 && NODE_ENV=development electron --inspect=9001 --remote-debugging-port=9002 lib/start-app'
