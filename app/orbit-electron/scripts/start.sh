#!/bin/bash

cd $(dirname $0)/..

if [ ! -d "./node_modules/iohook/builds/node-v59-darwin-x64" ]; then
  echo "building iohook first time..."
  if [ -x "$(command -v pyenv)" ]; then
    pyenv shell "2.7"
  fi
  rm -r node_modules/electron-rebuild/node_modules/node-abi
  npx electron-rebuild
fi

npx nodemon \
  --quiet \
  --watch _ \
  --watch $(realpath node_modules/@mcro/stores)/_ \
  --watch $(realpath node_modules/@mcro/constants)/_  \
  --watch $(realpath node_modules/@mcro/reactron)/_  \
  --watch $(realpath node_modules/@mcro/decor-mobx)/_  \
  --watch $(realpath node_modules/@mcro/decor-react)/_  \
  --watch $(realpath node_modules/@mcro/decor-classes)/_  \
  --watch $(realpath node_modules/@mcro/decor)/_  \
  --exec 'npx kill-port 9001 && NODE_ENV=development electron --inspect=9001 --remote-debugging-port=9002 scripts/start-development.js'

echo "bye orbit-electron"
