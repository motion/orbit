#!/bin/bash

rm -r app/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/desktop/node_modules/iohook
cp -r ./iohook/node_modules/iohook app/Orbit-darwin-x64/Orbit.app/Contents/Resources/app/node_modules/@mcro/desktop/node_modules
