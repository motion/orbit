#!/bin/bash

cp dist/index.html dist/about.html
cp public/stars.html dist/stars.html

# sub-pages
cp dist/index.html dist/about.html
cp dist/index.html dist/apps.html
cp dist/index.html dist/privacy.html
cp dist/index.html dist/terms.html

echo 'tryorbit.com' > dist/CNAME
echo '*' > dist/CORS
