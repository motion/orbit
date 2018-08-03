#!/bin/bash

cd $(dirname $0)/..

../orbit-electron/scripts/start.sh &
../orbit-desktop/scripts/start.sh &

wait

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT > /dev/null
echo "bye orbit"

