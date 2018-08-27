#!/bin/bash

cd $(dirname $0)/..

./scripts/start-debug-browser.sh &
../orbit-electron/scripts/start.sh &
../orbit-desktop/scripts/start.sh &
if [ "$1" = "start-prod" ]; then
  ../orbit-app/scripts/start.sh start-prod &
else
  ../orbit-app/scripts/start.sh &
fi


wait

