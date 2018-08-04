#!/bin/bash

# fail on exit, allow for exiting from verdaccio login
set -e

# cd root

cd $(dirname $0)/..

if [ "$1" = "--debug" ]; then
  DEBUG="electron-packager,electron-build:*"
fi

# prebuild

echo "installing iohook..."
(cd build-resources/iohook && npm install)

# version

if [[ "$@" =~ "--no-version" ]]; then
  echo "not versioning..."
else
  echo "bump version..."
  npm version patch
fi

#publish

if [[ "$@" =~ "--no-publish" ]]; then
  echo "not publishing..."
else
  echo "publishing packages for prod install..."

  echo "running verdaccio private registry..."
  kill $(lsof -t -i:4343)
  npx verdaccio -c ./scripts/verdaccio/config.yaml --listen 4343 &

  echo "making you log in..."
  npm login --registry=http://localhost:4343/ --scope=@mcro

  function publish-all() {
    npx lerna exec --stream --ignore "@mcro/orbit" -- npm publish --force
  }
  (cd ../.. && publish-all)

  # install

  if [[ "$@" =~ "--no-install" ]]; then
    echo "not installing"
  else
    echo "installing for prod... $(pwd)"
    (cd app-build && yarn install --production --registry http://localhost:4343)
  fi

  echo "killing verdaccio..."
  kill %-
fi

# bundle

echo "running electron-bundler..."
DEBUG=electron-packager node -r esm --trace-warnings ./scripts/bundle.js

echo "patching bundle..."
rm -r app-built/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/orbit-desktop/node_modules/iohook
cp -r ./build-resources/iohook/node_modules/iohook app-built/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/orbit-desktop/node_modules

# sign

echo "signing app..."
npx electron-osx-sign --ignore puppeteer/\\.local-chromium ./app-built/Orbit-darwin-x64/Orbit.app

# pack

echo "packing app into .dmg..."
npx electron-installer-dmg --overwrite --out ./app-built --icon ./resources/icon.icns ./app-built/Orbit-darwin-x64/Orbit.app Orbit
