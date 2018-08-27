#!/bin/bash

set -e

OUT_FILE="./dist/Orbit-$npm_package_version.app.zip"
echo "zipping $OUT_FILE"

function finish() {
  echo "cleaning app zip"
  rm $OUT_FILE
}
trap finish EXIT

if [ "$npm_package_version" = "" ]; then
  echo "to run: npm run publish"
  exit 0
fi

if [ ! -f "$OUT_FILE" ]; then
echo "zipping app..."
  # -y preserve symlinks
  # cd in because zip compressed the full path
  (cd ./dist/Orbit-darwin-x64 && zip -y -r9 -q $OUT_FILE ./Orbit.app)
  codesign -vfs "Developer ID Application: Nathan Wienert (399WY8X9HY)" --keychain login.keychain ./dist/Orbit.app.zip
  scp -r $OUT_FILE root@get.tryorbit.com:/updates/Orbit.app.zip
fi
