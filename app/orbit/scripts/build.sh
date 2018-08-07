#!/bin/bash

# fail on exit, allow for exiting from verdaccio login
set -e

cd $(dirname $0)

# --resume
FLAGs=$@
if [[ "$@" =~ "--resume" ]]; then
  FLAGS=`cat .lastbuild`
  echo "resuming with options $FLAGS"
fi
echo -n "" > .lastbuild

# run stuff from root of this package
cd ..

# BUILD

if [ "$1" = "--debug" ]; then
  DEBUG="electron-packager,electron-build:*"
fi

# iohook
if [[ "$@" =~ "--no-iohook" ]]; then
  echo "not building iohook..."
else
  echo "installing iohook..."
  (cd build-resources/iohook && npm install)
  echo -n "--no-iohook " >> .lastbuild
fi

# version
if [[ "$@" =~ "--no-version" ]]; then
  echo "not versioning..."
else
  echo "bump version..."
  npm version patch
  echo -n "--no-version " >> .lastbuild
fi

#publish
if [[ "$@" =~ "--no-install" ]]; then
  echo "not publishing..."
else
  echo "publishing packages for prod install..."

  # verdaccio
  echo "running verdaccio private registry..."
  kill $(lsof -t -i:4343) || true
  npx verdaccio -c ./scripts/verdaccio/config.yaml --listen 4343 &
  sleep 1
  echo "making you log in..."
  npm login --registry=http://localhost:4343/ --scope=@mcro

  # orbit-app
  echo "bundle orbit-app..."
  (cd ../orbit-app && npm run build-app)

  # publish packages
  function publish-all() {
    npx lerna exec --stream --ignore "@mcro/orbit" -- npm publish --force
  }
  (cd ../.. && publish-all)

  # install packages
  echo "installing for prod... $(pwd)"
  (cd app && yarn install --production --registry http://localhost:4343)

  # cleanup
  echo "killing verdaccio..."
  kill %-
  echo -n "--no-install " >> .lastbuild
fi

# bundle
echo "running electron-bundler..."
DEBUG=electron-packager node -r esm --trace-warnings ./scripts/bundle.js

echo "patching bundle..."
rm -r app-built/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/orbit-desktop/node_modules/iohook
cp -r ./build-resources/iohook/node_modules/iohook app-built/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/orbit-desktop/node_modules

# sign
if [[ "$@" =~ "--no-sign" ]]; then
  echo "not signing"
else
  echo "signing app..."
  npx electron-osx-sign --ignore puppeteer/\\.local-chromium ./app-built/Orbit-darwin-x64/Orbit.app
fi

# pack
if [[ "$@" =~ "--no-pack" ]]; then
  echo "not signing"
else
  echo "packing app into .dmg..."
  npx electron-installer-dmg --overwrite --out ./app-built --icon ./resources/icon.icns ./app-built/Orbit-darwin-x64/Orbit.app Orbit
fi
