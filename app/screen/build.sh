#!/bin/bash

# break on errors
set -e

if [ "$1" = "--if-empty" ]; then
  if [ -d "./orbit/Build" ]; then
    echo "already built screen once, run again with --force"
    exit 0
  fi
fi

. $(dirname $0)/../../bin/__/common

(cd swindler && carthage update --platform mac)

cd orbit
carthage update --cache-builds --platform mac
xcodebuild -configuration Release -derivedDataPath $(mktemp -d) -scheme orbit
