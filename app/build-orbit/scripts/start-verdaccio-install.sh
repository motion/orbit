#!/bin/bash

cd $(dirname $0)
kill $(lsof -t -i:4343) || true
npx verdaccio -c ./verdaccio/install-config.yaml --listen 4343
