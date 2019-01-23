#!/bin/sh

# cd to root
cd $(dirname $0)/..

./scripts/utils/png2icns.sh ./assets/appicon.png

# copy for production
mv ./appicon.icns ./assets
cp ./assets/appicon.icns ./app/orbit-electron/resources/icons

# copy for development
open ./assets
open ./app/orbit-electron/node_modules/electron/dist

echo "\n\n\n"
echo "1. in dist: right click Electron.app > Get info"
echo "2. in assets: drag appicon.icns to the electron icon on top left corner of info window"
echo "\n\n\n"
