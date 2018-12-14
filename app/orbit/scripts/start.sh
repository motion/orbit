#!/bin/bash

cd $(dirname $0)/..
FLAGS=$@

#
# FLAGS
#

if [[ "$FLAGS" =~ "--ignore-syncers" ]]; then
  echo "DISABLE SYNCERS"
  export DISABLE_SYNCERS="true"
fi

if [[ "$FLAGS" =~ "--ignore-electron" ]]; then
  echo "DISABLE ELECTRON"
  export IGNORE_ELECTRON="true"
fi

if [[ "$FLAGS" =~ "--ignore-menu" ]]; then
  echo "DISABLE MENU"
  export IGNORE_MENU="true"
fi

#
# START repl debugger
#

if [[ "$FLAGS" =~ "--ignore-repl" ]]; then
  echo "DISABLE REPL"
else
  (cd ../orbit-repl && npm start &)
fi

#
# START orbit-app
#

if [[ "$FLAGS" =~ "--ignore-app" ]]; then
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

if [[ "$FLAGS" =~ "--disable-watch" ]]; then
  echo "DISABLE WATCH"
  ./scripts/run-orbit.sh
else
  export PROCESS_NAME="electron"
  export STACK_FILTER="orbit-electron"
  # start app
  npx nodemon \
    --watch _ \
    --watch $(realpath node_modules/@mcro/orbit-electron)/_ \
    --watch $(realpath node_modules/@mcro/orbit-desktop)/_ \
    --delay 0.5 \
    --exec './scripts/run-orbit.sh'
fi

#
# END
#

echo "bye orbit!"

