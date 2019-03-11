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
# HANDLE package.json privacy
#

# get package.jsons to modify
cd $(dirname $0)/../../..
FILES=($(rg --files-with-matches -g "package.json" "private"))
cd -
function publicize-package-jsons() {
  cd $(dirname $0)/../../..
  for file in "${FILES[@]}"; do
    cp $file "$file.bak"
    sed -i '' '/"private": true/s/true/false/' $file
  done
  cd -
}
function undo-package-jsons() {
  cd $(dirname $0)/../../..
  for file in "${FILES[@]}"; do
    rm $file && mv "$file.bak" $file || echo "failed $file"
    sed -i '' '/"private": false/s/false/true/' $file # why is this necessary..
  done
  cd -
}
function handle-exit() {
  trap - EXIT
  undo-package-jsons
  exit 0
}

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
  # modify private stuff so we can publish
  publicize-package-jsons

  # clean old one since we are re-publishing
  rm -r /tmp/.verdaccio-storage || true

  # run verdaccio
  ./scripts/start-verdaccio-publish.sh &
  while ! nc -z localhost 4343; do sleep 0.1; done

  # publish packages
  (cd ../.. && \
    npx lerna exec \
      --ignore "orbit" \
      --ignore "@o/build" \
      --ignore "@o/orbit" \
      --ignore "@o/playground" \
      --ignore "@o/site" \
      --ignore "@o/babel-preset-motion" \
      --ignore "@o/gloss-displaynames" \
      --ignore "@o/blog" \
      --ignore "@o/cosal-test" \
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
  trap handle-exit EXIT
  publicize-package-jsons
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
    export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
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
(cd stage-app && ../node_modules/.bin/electron-rebuild)
# so desktop node subprocess can use it
rm -r stage-app/node_modules/sqlite3/lib/binding/node-v64-darwin-x64 || true
mv stage-app/node_modules/sqlite3/lib/binding/electron-v4.0-darwin-x64 stage-app/node_modules/sqlite3/lib/binding/node-v69-darwin-x64 || echo "didnt copy sqlite: ok on rebuild, error on first build"

# see stage-app/package.json for options
echo "electron-builder..."
(cd stage-app && npx electron-builder -p always)

