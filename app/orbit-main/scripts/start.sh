#!/bin/bash

docker-compose up -d

cd $(dirname $0)/..
FLAGS=$@

#
# FLAGS
#

if [[ "$FLAGS" =~ "--no-overmind" ]]; then
  echo "ENABLE OVERMIND DEVTOOLS"
else
  overmind-devtools &
fi

# disable menu by default
if [[ "$FLAGS" =~ "--yes-menu" ]]; then
  echo "ENABLE MENU"
else
  echo "DISABLE MENU"
  export DISABLE_MENU="true"
fi

if [[ "$FLAGS" =~ "--no-gpu" ]]; then
  echo "DISABLE GPU"
  export DISABLE_GPU="true"
fi

if [[ "$FLAGS" =~ "--no-syncers" ]]; then
  echo "DISABLE SYNCERS"
  export DISABLE_SYNCERS="true"
fi

if [[ "$FLAGS" =~ "--no-logging" ]]; then
  echo "DISABLE LOGGING"
  export DISABLE_LOGGING="true"
fi

if [[ "$FLAGS" =~ "--no-electron" ]]; then
  echo "DISABLE ELECTRON"
  export DISABLE_ELECTRON="true"
fi

#
# START repl debugger
#

if [[ "$FLAGS" =~ "--no-repl" ]]; then
  echo "DISABLE REPL"
else

  # its nice to debug just the main electron process by default
  export DEBUG_ELECTRON_MAIN=true

  (cd ../orbit-repl && npm start &)
fi

#
# START orbit-app
#

if [[ "$FLAGS" =~ "--no-app" ]]; then
  echo "DISABLE APP"
else
  if [ "$1" = "start-prod" ]; then
    ../orbit-app/scripts/start.sh start-prod &
  else
    ../orbit-app/scripts/start.sh &
  fi
fi

#
# START orbit-electron (and orbit-desktop via that)
#

if [[ "$FLAGS" =~ "--no-watch" ]]; then
  echo "DISABLE WATCH"
  ./scripts/run-orbit.sh
else
  export PROCESS_NAME="electron"
  export STACK_FILTER="orbit-electron"
  # start app
  npx nodemon \
    --watch _ \
    --watch $(realpath node_modules/@o/orbit-electron)/_ \
    --watch $(realpath node_modules/@o/orbit-desktop)/_ \
    --delay 0.5 \
    --exec './scripts/run-orbit.sh'
fi

#
# END
#

echo "bye orbit!"

