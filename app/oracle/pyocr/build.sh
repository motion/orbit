#!/bin/bash

pip3 install -U torch
pip3 install -U csv
pip3 install -U numpy
pip3 install -U pyinstaller

# build
rm -r dist/run || true
pyinstaller src/run.py
cp src/model.pyt dist/run

