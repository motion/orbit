#!/bin/bash

set -e

if [ "$npm_package_version" = "" ]; then
  echo "to run: npm run publish"
  exit 0
fi

echo "zipping app..."
zip -r9 -q ./dist/Orbit-$npm_package_version.app.zip ./dist/Orbit-darwin-x64/Orbit.app
codesign -vfs "Developer ID Application: Nathan Wienert (399WY8X9HY)" --keychain login.keychain ./dist/Orbit.app.zip
scp -r ./dist/Orbit-$npm_package_version.app.zip root@get.tryorbit.com:/updates/Orbit.app.zip
