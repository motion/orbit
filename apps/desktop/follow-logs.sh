#!/bin/bash

tail -f /tmp/orbit-desktop-out.log &
tail -f /tmp/orbit-desktop-err.log &
tail -f /tmp/orbit-debug-out.log &
tail -f /tmp/orbit-debug-err.log &
wait
