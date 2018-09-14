#!/bin/bash

pip3 install -U torch
pip3 install -U csv
pip3 install -U numpy
pip3 install -U onnx

python3 bridge.py py2app -A
