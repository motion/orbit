#!/bin/bash

cp dist/index.html dist/about.html
cp public/stars.html dist/stars.html

# sub-pages
cp dist/index.html dist/use-cases.html
cp dist/index.html dist/about.html
cp dist/index.html dist/privacy.html
cp dist/index.html dist/terms.html
cp dist/index.html dist/blog.html

echo '*' > dist/CORS
