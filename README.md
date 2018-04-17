## install

```sh
bin/bootstrap
```

## run

```sh
build # only need to do this once
# in separate tabs, run
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

1.  Fewer, powerful abstractions

@view + @store + @watch/@react

These things together are all you really need, but with them you can build incredibly powerful, complex, reactive systems with ease.

2.  Minimal, straightforward syntax

You shouldn't write your most important logic in reducers. You should be able to wire things together with the absolute minimum typing.

3.  Local state

Your state should live as close as possible to where its used, and be easy to move around.

4.  Some magic is ok, with the right tools

Simple syntax with powerful abstractions should let you move fast, but it requires extremely the building blocks to be easy to understand, and should have:

* types that help as you code
* granular, adjustable, clear logging
* an always-on REPL with all relevant things available as variables
* hot reload that maintains state
