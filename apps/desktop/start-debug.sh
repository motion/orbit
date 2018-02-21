#!/bin/bash
nodemon \
  --watch $(realpath node_modules/@mcro/dev) \
  --watch $(realpath node_modules/@mcro/dev/node_modules/@mcro/debug-apps) \
  --exec 'npm run start-debug' \
    ./node_modules/@mcro/dev

