#!/bin/bash

cd dist

index=$(find . -name "*.html")
ln -s $index ./index.html

# for surge add links for clean urls
# see web/router
ln -s .$index ./settings.html
ln -s .$index ./peek.html
ln -s .$index ./highlights.html
ln -s .$index ./auth.html

surge . seemirai.com
