#!/bin/bash

# publish to our github for auto updates

# root
cd $(dirname $0)/..

DIST="./dist"

if [ "$npm_package_version" = "" ]; then
  echo "to run: npm run publish"
  exit 0
fi

# prepare for publish by version
if [ ! -f "$DIST/Orbit-$npm_package_version.dmg" ]; then
  echo "zipping into versioned file..."
  cp $DIST/Orbit.dmg $DIST/Orbit-$npm_package_version.dmg
  zip -r -X -8 -q $DIST/Orbit-$npm_package_version-mac.zip $DIST/Orbit-darwin-x64/Orbit.app
fi

# publish
npx publish ./scripts/publish-config.json -p $DIST -d

# clean up
rm -r $DIST/Orbit-$npm_package_version-mac.zip
mkdir -p $DIST/releases
mv $DIST/Orbit-$npm_package_version.dmg $DIST/releases
