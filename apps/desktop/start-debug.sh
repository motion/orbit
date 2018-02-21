#!/bin/bash
echo "starting debug browser..."
npx kill-port 8001
npx dev-apps &
wait
