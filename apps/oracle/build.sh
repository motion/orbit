#!/bin/bash

if [ "$1" = "--if-empty" ]; then
  if [ -d "./orbit/Build" ]; then
    echo "already built oracle once"
    exit 0
  fi
fi

python3 ./install.py
(cd swindler && carthage update --platform mac)
(cd pyocr && ./build.sh)

cd orbit
carthage update --cache-builds --platform mac
xcodebuild -configuration Release -derivedDataPath $(mktemp -d) -scheme orbit
touch ../desktop/src/index.js
