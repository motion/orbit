#!/bin/bash

# publish to our github for auto updates

# root
cd $(dirname $0)/..

# prepare for publish by version
if [ ! -f "./app/Orbit-$npm_package_version.dmg" ]; then
  cp ./app/Orbit.dmg ./app/Orbit-$npm_package_version.dmg
  zip -r -X -8 -q ./app/Orbit-$npm_package_version-mac.zip ./app/Orbit-darwin-x64/Orbit.app
fi

# publish
npx publish -p ./app

# clean up
rm -r ./app/Orbit-$npm_package_version-mac.zip
mkdir -p ./app/releases
mv ./app/Orbit-$npm_package_version.dmg ./app/releases
