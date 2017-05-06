FROM klaemo/couchdb:latest

ARG ENV="prod"
ENV ENV=${ENV}

COPY ./apps/couch/config/local.ini /opt/couchdb/etc
