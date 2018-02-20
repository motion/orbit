#!/bin/bash

tmux new-session -d -s orbit 'build --watch'
tmux split-window -h 'npm run start-desktop'
tmux split-window -v 'npm run start-app'
tmux split-window -h 'npm run start-electron'
tmux split-window -h 'sleep 3 && npm run start-debug'
tmux set-option -t orbit:0 remain-on-exit
tmux -CC -2 attach-session -d
