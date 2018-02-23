#!/bin/bash
npx kill-port 3002
until ../../node_modules/.bin/parcel -p 3002 index.html; do
  echo "AppError: parcel crash, restarting..." >&2
  sleep 1
done
