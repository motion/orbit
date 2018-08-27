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
if [[ "$FLAGS" =~ "--no-app-bundle" ]]; then
  echo "not bundling..."
else
  echo "bundling..."
  (cd ../orbit-app && npm run build-app)
fi
echo -n "--no-app-bundle " >> ./scripts/.lastbuild

function publish-packages() {
  # clean old one since we are re-publishing
  rm -r /tmp/.verdaccio-storage || true
  # run verdaccio
  ./scripts/start-verdaccio-publish.sh &
  while ! nc -z localhost 4343; do sleep 0.1; done
  # publish packages
  (cd ../.. && \
    npx lerna exec --ignore "orbit" --ignore "@mcro/orbit" -- \
        npm publish --force --registry http://localhost:4343)
  # then publish main app with all packages
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
  ./scripts/start-verdaccio-install.sh &
  while ! nc -z localhost 4343; do sleep 0.1; done
  # install
  echo "installing for prod... $(pwd)"
  cd ./stage-app
    rm -r node_modules || true
    rm package-lock.json || true
    npm install --production --registry http://localhost:4343
  cd -
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
if [[ "$FLAGS" =~ "--no-bundle" ]]; then
  echo "not bundling..."
else
  echo "running electron-bundler..."
  DEBUG=electron-packager node -r esm --trace-warnings ./scripts/bundle.js
fi
echo -n "--no-install " >> ./scripts/.lastbuild

echo "patching bundle..."
rm -r dist/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/sqlite3/build || true

echo "fixing sqlite for desktop process..."
cp -r dist/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/sqlite3/lib/binding/electron-v3.0-darwin-x64 dist/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/sqlite3/lib/binding/node-v64-darwin-x64 || true

# sign
if [[ "$FLAGS" =~ "--no-sign" ]]; then
  echo "not signing"
else
  echo "signing app..."
  npx electron-osx-sign --ignore oracle ./dist/Orbit-darwin-x64/Orbit.app
fi
echo -n "--no-sign " >> ./scripts/.lastbuild

# pack
if [[ "$FLAGS" =~ "--no-pack" ]]; then
  echo "not signing"
else
  echo "packing app into .dmg..."
  npx electron-installer-dmg --overwrite --out ./dist --icon ./resources/icon.icns ./dist/Orbit-darwin-x64/Orbit.app Orbit
  codesign -vfs "3rd Party Mac Developer Application: Nathan Wienert (399WY8X9HY)" --keychain login.keychain ./dist/Orbit.dmg
fi
