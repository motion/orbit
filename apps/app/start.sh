#!/bin/bash
npx kill-port 3002
echo "parcel -p 3002 index.html ${@:1}"
echo "parcel $(../../node_modules/.bin/parcel --version)"
until ../../node_modules/.bin/parcel -p 3002 index.html ${@:1}; do
  echo "AppError: parcel crash, restarting..." >&2
  sleep 1
done
