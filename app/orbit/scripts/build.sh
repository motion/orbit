#!/bin/bash

echo "running verdaccio private registry..."
kill $(lsof -t -i:4343)
npx verdaccio --listen 4343 &

sleep 1

echo "making you log in..."
npm login --registry=http://localhost:4343/ --scope=@mcro

# fail on exit, allow for exiting from verdaccio login
set -e

# cd root
cd $(dirname $0)/..

if [ "$1" = "--debug" ]; then
  DEBUG="electron-packager,electron-build:*"
fi

echo "installing iohook..."
(cd build-resources/iohook && npm install)

echo "bump version..."
npm version patch

echo "publishing packages for prod install..."
function publish-all() {
  npx lerna exec -- npm unpublish --force --registry http://localhost:4343 && npm publish --registry http://localhost:4343
}
(cd ../.. && publish-all)

echo "installing for prod..."
echo $(pwd)
(cd ../orbit-desktop && yarn install --production --registry http://localhost:4343)
(cd ../orbit-electron && yarn install --production --registry http://localhost:4343)

echo "killing verdaccio..."
kill %-

echo "running electron-bundler..."
DEBUG=electron-packager node -r esm --trace-warnings ./scripts/bundle.js &

echo "patching bundle..."
rm -r app/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/desktop/node_modules/iohook
cp -r ./build-resources/iohook/node_modules/iohook app/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/desktop/node_modules

echo "signing app..."
npx electron-osx-sign --ignore puppeteer/\\.local-chromium ./app/Orbit-darwin-x64/Orbit.app

echo "packing app into .dmg..."
npx electron-installer-dmg --overwrite --out ./app --icon ./resources/icon.icns ./app/Orbit-darwin-x64/Orbit.app Orbit
