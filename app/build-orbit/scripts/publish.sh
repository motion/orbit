#!/bin/bash

set -e

# root
cd $(dirname $0)/..

if [ "$npm_package_version" = "" ]; then
  echo "run with npm run publish-app"
  exit 0
fi

scp ./dist/*.yml root@get.tryorbit.com:/updates
scp ./dist/*.yaml root@get.tryorbit.com:/updates
scp ./dist/Orbit-$npm_package_version-mac.zip root@get.tryorbit.com:/updates

# cleanup
rm ./dist/Orbit-*.zip
