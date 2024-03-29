#!/bin/bash

# kill any old stuck verdaccio
kill $(lsof -t -i:4343) 2> /dev/null || true

# fail on exit, allow for exiting from verdaccio login
set -e

THIS_DIR=$(realpath $(dirname $0))

# start in root of this package
cd $THIS_DIR/..

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
cd $THIS_DIR/../../..
FILES=($(rg --files-with-matches -g "package.json" "private"))
cd -
function publicize-package-jsons() {
  cd $THIS_DIR/../../..
  for file in "${FILES[@]}"; do
    cp $file "$file.bak"
    sed -i '' '/"private": true/s/true/false/' $file
  done
  cd -
}
function undo-package-jsons() {
  cd $THIS_DIR/../../..
  for file in "${FILES[@]}"; do
    if [ -f "$file.bak" ]; then
      rm $file && mv "$file.bak" $file || echo "failed $file"
      sed -i '' '/"private": false/s/false/true/' $file # why is this necessary..
    fi
  done
  cd -
}

function handle-exit() {
  trap - EXIT
  undo-package-jsons
  exit 0
}
trap handle-exit EXIT

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
# if [[ "$FLAGS" =~ "--no-build-app" ]]; then
#   echo "not bundling..."
# else
#   echo "bundling..."
#   cd ../orbit-app
#   # remove old app dir so we dont have old files there
#   rm -r dist || true
#   npm run build:app
#   cd -
# fi
# echo -n "--no-build-app " >> ./scripts/.lastbuild

function publish-packages() {
  # modify private stuff so we can publish
  publicize-package-jsons

  # clean old one since we are re-publishing
  rm -r /tmp/.verdaccio-storage || true

  # run verdaccio
  ./scripts/start-verdaccio-publish.sh &
  while ! nc -z localhost 4343; do sleep 0.1; done

  # register/login
  curl -s -H "Accept: application/json" -H "Content-Type:application/json" -X PUT --data '{"name": "orbit", "password": "i_love_orbit123"}' http://localhost:4343/-/user/org.couchdb.user:username
  {
    echo "orbit"
    sleep 1
    echo "i_love_orbit123"
    sleep 1
    echo "orbit@tryorbit.com"
  } | npm login --registry http://localhost:4343


  # publish packages
  (cd ../.. && \
    npx lerna exec --stream \
      --ignore "orbit" \
      --ignore "@o/build" \
      --ignore "@o/playground" \
      --ignore "@o/site" \
      --ignore "@o/babel-preset-motion" \
      --ignore "@o/site" \
      --ignore "@o/cosal-test" \
      --ignore "@o/build-orbit" \
      --ignore "@o/example-workspace" \
      --ignore "@o/orbit-api" \
      --ignore "@o/orbit-registry" \
      --ignore "@o/demo-app-api-grid" \
      --ignore "@o/website-app" \
      --ignore "@o/search-app" \
      --ignore "@o/slack-app" \
      --ignore "@o/gmail-app" \
      --ignore "@o/postgres-app" \
      --ignore "@o/lists-app" \
      --ignore "@o/people-app" \
      --ignore "@o/demo-app-layout" \
      --ignore "@o/demo-app-flow" \
      --ignore "@o/confluence-app" \
      --ignore "@o/jira-app" \
      --ignore "@o/github-app" \
      --ignore "@o/orbit-dotapp" \
      --ignore "@o/orbit-repl" \
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
if [[ "$FLAGS" =~ "--no-rebuild" ]]; then
  echo "not rebuilding"
else
  (cd stage-app && ../node_modules/.bin/electron-rebuild)
  # so desktop node subprocess can use it
  rm -r stage-app/node_modules/sqlite3/lib/binding/node-v64-darwin-x64 || true
  mv stage-app/node_modules/sqlite3/lib/binding/electron-v4.0-darwin-x64 stage-app/node_modules/sqlite3/lib/binding/node-v69-darwin-x64 || echo "didnt copy sqlite: ok on rebuild, error on first build"
fi

#
# ensure base dlls present (where should this actually go?? a watcher at build time + rebuild on build?)
#
function ensure-dlls() {
  echo "ensuring dlls..."
  cd ../orbit-desktop
    mkdir dist || true
    rm dist/orbit-manifest-base.json || true
    rm dist/shared.dll.js || true
    cp ../../example-workspace/dist/production/orbit-manifest-base.json dist/orbit-manifest-base.json
    cp ../../example-workspace/dist/production/shared.dll.js dist/shared.dll.js
  cd -
}
ensure-dlls

# see stage-app/package.json for options
echo "electron-builder..."
if [[ "$FLAGS" =~ "--no-sign" ]]; then
  (cd stage-app && CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder)
else
  (cd stage-app && npx electron-builder -p always)
fi

