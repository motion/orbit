FROM klaemo/couchdb:latest

ARG ENV="prod"
ENV ENV=${ENV}

COPY ./apps/couch/config/local.ini /usr/local/etc/couchdb
