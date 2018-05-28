#!/bin/bash

npx nodemon \
  --quiet \
  --watch _ \
  --watch $(realpath node_modules/@mcro/all)/_ \
  --watch $(realpath node_modules/@mcro/black)/_ \
  --watch $(realpath node_modules/@mcro/constants)/_  \
  --watch $(realpath node_modules/@mcro/reactron)/_  \
  --watch $(realpath node_modules/@mcro/decor-mobx)/_  \
  --watch $(realpath node_modules/@mcro/decor-react)/_  \
  --watch $(realpath node_modules/@mcro/decor-classes)/_  \
  --watch $(realpath node_modules/@mcro/decor)/_  \
  --watch $(realpath node_modules/@mcro/debug)  \
  --watch $(realpath node_modules/@mcro/automagical)/_  \
  --exec 'npx kill-port 9001 && NODE_ENV=development electron -r esm --inspect=9001 --remote-debugging-port=9002 _/start-app'
