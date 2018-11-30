#!/bin/bash

pip3 install -U torch
pip3 install -U csv
pip3 install -U numpy
pip3 install -U pyinstaller

# build
rm -r dist/run || true
pyinstaller src/run.py
cp src/model.pyt dist/run

# cleanup big unecessary files
cd dist/run/torch
rm -r lib/libcaffe2.dylib
rm -r __pycache__
rm -r autograd
rm -r backends
rm -r contrib
rm -r cuda
rm -r distributed
rm -r distributions
rm -r legacy
rm -r optim
rm -r serialization.py
rm -r sparse
rm -r tensor.py
rm -r nn
rm -r lib/libcrypto.1.0.0.dylib
rm -r lib/libssl.1.0.0.dylib
cd -
