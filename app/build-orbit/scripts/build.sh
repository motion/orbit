#!/bin/bash

# fail on exit, allow for exiting from verdaccio login
set -e

# start in root of this package
cd $(dirname $0)/..

# --resume
FLAGS=$@
if [ "$1" = "--resume" ]; then
  FLAGS=`cat ./scripts/.lastbuild`
  echo "resuming with options $FLAGS"
fi
echo -n "" > ./scripts/.lastbuild

# BUILD

if [[ "$FLAGS" =~ "--debug" ]]; then
  DEBUG="electron-packager,electron-build:*"
fi

# iohook
if [[ "$FLAGS" =~ "--no-iohook" ]]; then
  echo "not building iohook..."
else
  echo "installing iohook..."
  (cd build-resources/iohook && npm install)
fi
echo -n "--no-iohook " >> ./scripts/.lastbuild

# version
if [[ "$FLAGS" =~ "--no-version" ]]; then
  echo "not versioning..."
else
  echo "bump version..."
  npm version patch
fi
echo -n "--no-version " >> ./scripts/.lastbuild

# bundle
if [[ "$FLAGS" =~ "--no-bundle" ]]; then
  echo "not bundling..."
else
  echo "bundling..."
  (cd ../orbit-app && npm run build-app)
fi
echo -n "--no-bundle " >> ./scripts/.lastbuild

function publish-packages() {
  # clean old one since we are re-publishing
  rm -r /tmp/.verdaccio-storage
  # run verdaccio
  kill $(lsof -t -i:4343) || true
  npx verdaccio -c ./scripts/verdaccio/publish-config.yaml --listen 4343 &
  while ! nc -z localhost 4343; do sleep 0.1; done
  # publish
  (cd ../.. && npx lerna exec --ignore "@mcro/build-orbit" --ignore "@mcro/orbit" -- npm publish --registry http://localhost:4343 --force)
  # then publish main app all together
  (cd ../orbit && npm publish --registry http://localhost:4343 --force)
  # kill verdaccio
  kill %-
  kill $(lsof -t -i:4343) || true
}

# publish
if [[ "$FLAGS" =~ "--no-publish" ]]; then
  echo "not publishing..."
else
  echo "publishing packages..."
  publish-packages
fi
echo -n "--no-publish " >> ./scripts/.lastbuild

function install-packages() {
  # run verdaccio
  npx verdaccio -c ./scripts/verdaccio/install-config.yaml --listen 4343 &
  while ! nc -z localhost 4343; do sleep 0.1; done
  # install
  echo "installing for prod... $(pwd)"
  (cd ./stage-app && npm install --production --registry http://localhost:4343)
  # kill verdaccio
  kill %-
  kill $(lsof -t -i:4343) || true
}

# install
if [[ "$FLAGS" =~ "--no-install" ]]; then
  echo "not installing..."
else
  echo "installing packages..."
  install-packages
fi
echo -n "--no-install " >> ./scripts/.lastbuild

# bundle
echo "running electron-bundler..."
DEBUG=electron-packager node -r esm --trace-warnings ./scripts/bundle.js

# echo "patching bundle..."
# rm -r dist/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/orbit-desktop/node_modules/iohook
# cp -r ./build-resources/iohook/node_modules/iohook dist/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/orbit-desktop/node_modules

# sign
if [[ "$FLAGS" =~ "--no-sign" ]]; then
  echo "not signing"
else
  echo "signing app..."
  npx electron-osx-sign --ignore puppeteer/\\.local-chromium ./dist/Orbit-darwin-x64/Orbit.app
fi
echo -n "--no-sign " >> ./scripts/.lastbuild

# pack
if [[ "$FLAGS" =~ "--no-pack" ]]; then
  echo "not signing"
else
  echo "packing app into .dmg..."
  npx electron-installer-dmg --overwrite --out ./dist --icon ./resources/icon.icns ./dist/Orbit-darwin-x64/Orbit.app Orbit
fi
