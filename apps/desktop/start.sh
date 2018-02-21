#!/bin/bash

dev-apps &
npm run start-monitoring &
wait $!
echo "done"
for job in `jobs -p`; do
  echo $job
  kill $job
done
