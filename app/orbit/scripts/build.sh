#!/bin/bash

# fail on exit
set -e

# cd root
cd $(dirname $0)/..

if [ "$1" = "--debug" ]; then
  DEBUG="electron-packager,electron-build:*"
fi

(cd build-resources/iohook && npm install)

function publish-for-production() {
  # cd to monorepo root
  cd ../..
  npx lerna publish
}

npm version patch

# run verdaccio and reinstall stuff for bundling
veraccioPID=$!
verdaccio &

# install
publish-for-production

kill $veraccioPID


# publish packages to verdaccio
DEBUG=electron-packager node -r esm --trace-warnings ./scripts/bundle.js &


# fix bundle
rm -r app/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/desktop/node_modules/iohook
cp -r ./build-resources/iohook/node_modules/iohook app/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/desktop/node_modules

# sign app
  npx electron-osx-sign --ignore puppeteer/\\.local-chromium ./app/Orbit-darwin-x64/Orbit.app
}

# pack app
npx electron-installer-dmg --overwrite --out ./app --icon ./resources/icon.icns ./app/Orbit-darwin-x64/Orbit.app Orbit
