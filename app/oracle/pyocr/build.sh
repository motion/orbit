#!/bin/bash

pip3 install -U torch
pip3 install -U csv
pip3 install -U numpy

python3 bridge.py py2app -A
