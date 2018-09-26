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

#
# BUILD
#

if [[ "$FLAGS" =~ "--debug" ]]; then
  DEBUG="electron-packager,electron-build:*"
fi

#
# version
#
if [[ "$FLAGS" =~ "--no-version" ]]; then
  echo "not versioning..."
else
  echo "bump version..."
  npm version patch
  (cd stage-app && npm version patch)
fi
echo -n "--no-version " >> ./scripts/.lastbuild

#
# bundle
#
if [[ "$FLAGS" =~ "--no-build-app" ]]; then
  echo "not bundling..."
else
  echo "bundling..."
  cd ../orbit-app
  # remove old app dir so we dont have old files there
  rm -r dist || true
  npm run build-app
  cd -
fi
echo -n "--no-build-app " >> ./scripts/.lastbuild

function publish-packages() {
  # clean old one since we are re-publishing
  rm -r /tmp/.verdaccio-storage || true
  # run verdaccio
  ./scripts/start-verdaccio-publish.sh &
  while ! nc -z localhost 4343; do sleep 0.1; done
  # publish packages
  (cd ../.. && \
    npx lerna exec \
      --ignore "orbit" \
      --ignore "@mcro/build" \
      --ignore "@mcro/orbit" \
      --ignore "@mcro/playground" \
      --ignore "@mcro/site" \
      --ignore "@mcro/oauth-server" \
      --ignore "@mcro/babel-preset-motion" \
      --ignore "@mcro/gloss-displaynames" \
      -- npm publish --force --registry http://localhost:4343)
  # then publish main app with all packages
  (cd ../orbit && npm publish --registry http://localhost:4343 --force)
  # kill verdaccio
  kill %-
  kill $(lsof -t -i:4343) || true
}

#
# publish
#
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

#
# install
#
if [[ "$FLAGS" =~ "--no-install" ]]; then
  echo "not installing..."
else
  echo "installing packages..."
  install-packages
fi
echo -n "--no-install " >> ./scripts/.lastbuild

#
# clean old
#
rm -r dist/mac/Orbit.app || true

#
# fix sqlite
#
(cd stage-app && ../node_modules/.bin/electron-rebuild --version 3.0.0-beta.1)
# so desktop node subprocess can use it
rm -r stage-app/node_modules/sqlite3/lib/binding/node-v64-darwin-x64 || true
cp -r stage-app/node_modules/sqlite3/lib/binding/electron-v3.0-darwin-x64 stage-app/node_modules/sqlite3/lib/binding/node-v64-darwin-x64

# see stage-app/package.json for options
echo "electron-builder..."
(cd stage-app && npx electron-builder -p always)
