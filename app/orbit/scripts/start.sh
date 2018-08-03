#!/bin/bash

cd $(dirname $0)/..

./start-debug-browser.sh &
../orbit-electron/scripts/start.sh &
../orbit-desktop/scripts/start.sh &
../orbit-app/script/start.sh &

wait

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null
echo "bye orbit"

