#!/bin/bash

# cd to root
cd $(dirname $0)/..

npx nodemon \
  --watch _ \
  --watch $(realpath node_modules/@o/debug-apps) \
  --exec 'npx orbit-repl'

echo "bye orbit-repl"
