#!/bin/bash

# break on errors
set -e

if [ "$1" = "--if-empty" ]; then
  if [ -d "./orbit/Build" ]; then
    echo "already built oracle once, run again with --force"
    exit 0
  fi
fi

. $(dirname $0)/../../bin/__/common

# have to install with shared cython library
ensure-dep "pyenv" -- env PYTHON_CONFIGURE_OPTS="--enable-shared" pyenv install -v 3.6.1

# symlink from multicore shared lib to non
# i needed this but not sure if py2app is bundling this properly later or just using shared lib?
ln -s ~/.pyenv/versions/3.6.1/lib/libpython3.6m.dylib ~/.pyenv/versions/3.6.1/lib/libpython3.6.dylib
ln -s ~/.pyenv/versions/3.6.1/lib/libpython3.6m.a ~/.pyenv/versions/3.6.1/lib/libpython3.6.a

pip3 install -U pyobjc
(cd swindler && carthage update --platform mac)
(cd pyocr && ./build.sh)

cd orbit
carthage update --cache-builds --platform mac
xcodebuild -configuration Release -derivedDataPath $(mktemp -d) -scheme orbit
