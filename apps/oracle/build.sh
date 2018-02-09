#!/bin/bash

cd orbit
xcodebuild -configuration Release -derivedDataPath $(mktemp -d) -scheme orbit
touch ../apps/api/src/index.js
