#!/bin/bash

if [[ "$(lsof -i TCP:3001 | wc -c)" -ne 0 ]]; then
  parcel -p 3002 ./public/index.html
else
  echo "before web run:"
  echo "$ run api"
fi