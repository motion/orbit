#!/bin/sh

# cd to root
cd $(dirname $0)/..

pngcrush ./assets/appicon.png ./assets/appicon2.png
rm ./assets/appicon.png
mv  ./assets/appicon2.png ./assets/appicon.png
./scripts/utils/png2icns.sh ./assets/appicon.png

# copy for production
mv ./appicon.icns ./assets

rm ./app/orbit-electron/resources/icons/appicon.icns
cp ./assets/appicon.icns ./app/orbit-electron/resources/icons

# copy for development
rm ./app/orbit-electron/resources/icons/appicon.png
cp ./assets/appicon.png ./app/orbit-electron/resources/icons
