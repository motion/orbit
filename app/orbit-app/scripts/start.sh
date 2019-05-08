#!/bin/bash

# cd to this package root
cd $(dirname $0)/..

FLAGS=$@

echo "flags: $FLAGS"

if [[ "$FLAGS" =~ "--prod" ]]; then
  echo "start orbit-app production mode..."
  export NODE_ENV="production"
fi

npx kill-port 3999

export PROCESS_NAME="app"
export STACK_FILTER="orbit-app"

npx mcro-build --entry ./src/main --port 3999 $FLAGS

echo "bye orbit-app"
