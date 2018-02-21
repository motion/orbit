#!/bin/bash

export TERM=xterm-256color

tmux source-file ./tmux.conf

tmux new-session -d -s orbit 'npm run start-desktop'
tmux split-window -v 'cd ../.. && build --watch'
tmux split-window -h 'npm run start-app'
tmux split-window -v 'npm run start-electron'
tmux split-window -v 'sleep 3 && npm run start-debug'
tmux set-option -t orbit:0 remain-on-exit
tmux -CC -2 attach-session -d
