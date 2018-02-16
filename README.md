## install

```sh
bin/bootstrap
```

## run

```sh
build # only need to do this once
# in separate tabs, run
build --watch
run app
run desktop
run electron
```

## deploy

```
# deploy app to public web
build app
deploy app
# build production electron + desktop app
build electron
# test it with:
run electron --prod
# push it to release servers
deploy electron
```
