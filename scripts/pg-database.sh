#!/bin/sh

# cd to root
cd $(dirname $0)/..

if [ ! -d ./pata-postgres ]; then
    mkdir ./data
    mkdir ./data/postgres
fi

if [ ! -f ./data/postgres/1-pagila-schema.sql ]; then
    curl https://raw.githubusercontent.com/devrimgunduz/pagila/master/pagila-schema.sql > ./data/postgres/1-pagila-schema.sql
fi

if [ ! -f ./data/postgres/2-pagila-data.sql ]; then
    curl https://raw.githubusercontent.com/devrimgunduz/pagila/master/pagila-data.sql > ./data/postgres/2-pagila-data.sql
fi



