#!/bin/bash
npx kill-port 3003
until ../../node_modules/.bin/parcel -p 3003 src/index.js; do
  echo "SearchError: parcel crash, restarting..." >&2
  sleep 1
done
