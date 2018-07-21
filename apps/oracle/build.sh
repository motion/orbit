#!/bin/bash

# break on errors
set -e

if [ "$1" = "--if-empty" ]; then
  if [ -d "./orbit/Build" ]; then
    echo "already built oracle once, run again with --force"
    exit 0
  fi
fi

pip3 install -U pyobjc
(cd swindler && carthage update --platform mac)
(cd pyocr && ./build.sh)

cd orbit
carthage update --cache-builds --platform mac
xcodebuild -configuration Release -derivedDataPath $(mktemp -d) -scheme orbit
