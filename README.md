## install

```sh
bin/bootstrap
# only need to do this once to get everything built out
build
```

## run

```sh
# to build sub packages and apps
build --watch
# once that runs in separate tabs, run
run desktop
run app
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

## principles

This stack is built around a few principles that guide everything in it.

1.  Few powerful abstractions

@view + @store + @react

These things together are all you really need, but with them you can build incredibly powerful, complex, reactive systems with ease.

2.  Local state, simple Mobx

Your state should live as close as possible to where its used, and be easy to move around.

3.  Have good logs/tooling/repl

* types that help as you code
* granular, adjustable, clear logging
* an always-on REPL with all relevant things available as variables
* hot reload that maintains state
