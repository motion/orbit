#!/bin/bash

if [ "$1" -eq "--if-empty" ]; then
  if [ -d "./orbit/Build" ]; then
    echo "already built oracle once, run again with --force"
    exit 0
  fi
fi

python3 ./install.py
(cd swindler && carthage update --platform mac)
(cd pyocr && ./build.sh)

cd orbit
carthage update --cache-builds --platform mac
xcodebuild -configuration Release -derivedDataPath $(mktemp -d) -scheme orbit
