#!/bin/bash

# cd root
cd $(dirname $0)/..

if [ "$1" = "--debug" ]; then
  DEBUG="electron-packager,electron-build:*"
fi

(cd build-resouces/iohook && npm install)

npm version patch

function bundle-app() {
  DEBUG=electron-packager node -r esm --trace-warnings ./scripts/bundle.js
}

function fix-bundle() {
  rm -r app/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/desktop/node_modules/iohook
  cp -r ./build-resources/iohook/node_modules/iohook app/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/desktop/node_modules
}

function sign-app() {
  npx electron-osx-sign --ignore puppeteer/\\.local-chromium ./app/Orbit-darwin-x64/Orbit.app
}

function pack-app() {
  npx electron-installer-dmg --overwrite --out ./app --icon ./resources/icon.icns ./app/Orbit-darwin-x64/Orbit.app Orbit
}

bundle-app
fix-bundle
sign-app
pack-app
