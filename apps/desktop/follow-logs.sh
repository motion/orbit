#!/bin/bash
tail -n 0 -f /tmp/orbit-desktop-out.log &
tail -n 0 -f /tmp/orbit-desktop-err.log &
wait
