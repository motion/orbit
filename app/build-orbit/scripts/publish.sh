#!/bin/bash

set -e

# publish to our github for auto updates

# root
cd $(dirname $0)/..

if [ "$npm_package_version" = "" ]; then
  echo "to run: npm run publish"
  exit 0
fi

scp ./dist/*.json root@get.tryorbit.com:/updates
scp ./dist/*.yaml root@get.tryorbit.com:/updates
scp ./dist/*-mac.zip root@get.tryorbit.com:/updates
