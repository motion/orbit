#!/bin/bash

set -e

# root
cd $(dirname $0)/..

scp ./dist/*.yml root@get.tryorbit.com:/updates
scp ./dist/*.yaml root@get.tryorbit.com:/updates
scp ./dist/*-mac.zip root@get.tryorbit.com:/updates
