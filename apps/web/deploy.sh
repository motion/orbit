#!/bin/bash

cd dist

# for surge add links for clean urls
# see web/router
ln -s ./index.html ./settings.html
ln -s ./index.html ./peek.html
ln -s ./index.html ./highlights.html
ln -s ./index.html ./relevancy.html
ln -s ./index.html ./auth.html

surge . seemirai.com
