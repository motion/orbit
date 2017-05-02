#!/bin/bash

. $(dirname $0)/__common
cd $ROOT

# to generate
# kompose -f docker-compose.prod.yml convert -o infra/kubes

kubectl create secret docker-registry myregistrykey \
  --docker-server=$DOCKER_REGISTRY_SERVER \
  --docker-username=$DOCKER_USER \
  --docker-password=$DOCKER_PASSWORD \
  --docker-email=$DOCKER_EMAIL

echo $NAMESPACE

kubectl delete service starter-couchdb --namespace $NAMESPACE
kubectl delete service starter-api --namespace $NAMESPACE

kompose up -f docker-compose.prod.yml --namespace $NAMESPACE
