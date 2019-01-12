#!/bin/bash

cd $(dirname $0)/..

npx kill-port 9001
npx kill-port 9002
npx kill-port 9003
export ELECTRON_DISABLE_SECURITY_WARNINGS=true
export NODE_ENV=development
electron --async-stack-traces --inspect=9001 --remote-debugging-port=9002 _/main.js
``
