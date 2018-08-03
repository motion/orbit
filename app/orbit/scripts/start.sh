#!/bin/bash

cd $(dirname $0)/..

./scripts/start-debug-browser.sh &

../orbit-electron/scripts/start.sh &
../orbit-desktop/scripts/start.sh &
../orbit-app/scripts/start.sh &

wait

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null
echo "bye orbit"

