#!/bin/bash

set -e

# publish to our github for auto updates

# root
cd $(dirname $0)/..

if [ "$npm_package_version" = "" ]; then
  echo "to run: npm run publish"
  exit 0
fi

# publish .app.zip
zip -r9 -q ./dist/Orbit.app.zip ./dist/Orbit-darwin-x64/Orbit.app
codesign -vfs "Developer ID Application: Nathan Wienert (399WY8X9HY)" --keychain login.keychain ./dist/Orbit.app.zip
scp -r ./dist/Orbit.app.zip root@get.tryorbit.com:/updates/Orbit.app.zip

# prepare for publish by version
if [ ! -f "./dist/Orbit-$npm_package_version.dmg" ]; then
  echo "zipping into versioned file..."
  cp ./dist/Orbit.dmg ./dist/Orbit-$npm_package_version.dmg
  zip -r -X -8 -q ./dist/Orbit-$npm_package_version-mac.zip ./dist/Orbit-darwin-x64/Orbit.app
fi

# publish
npx publish ./scripts/publish-config.json -p ./dist -d

# clean up
rm -r ./dist/Orbit-$npm_package_version-mac.zip
mkdir -p ./dist/releases
mv ./dist/Orbit-$npm_package_version.dmg ./dist/releases
