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

@view + @store + react

These things together are all you really need, but with them you can build incredibly powerful, complex, reactive systems with ease.

See automagical README.md

2.  Local state, simple Mobx

Your state should live as close as possible to where its used, and be easy to move around.

3.  Have good logs/tooling/repl

- types that help as you code
- granular, adjustable, clear logging
- an always-on REPL with all relevant things available as variables
- hot reload that maintains state

## using the monorepo

Because lerna links things together it can cause some weirdness with installing packages. There are a few ways to do it. All examples start at the root directory.

1.  `install`

```
cd apps/desktop
install randomcolor
```

2.  Using the `in` command

The `in` command finds the sub-package or app and just cd's into it before doing something. So you can do something like:

```
in desktop install randomcolor
```

likewise you can do other things:

```
in models npm start
```

3.  Using lerna

The lerna command supports this:

```
npx lerna add packagename --scope @mcro/desktop
```

4.  modify the package.json directly, and then:

```
bootstrap
```

Bootstrap sort of checks a lot of stuff, but its really fast, so you can generally just modify a lot of package.json's and then run `bootstrap` after.

## Other commands

- `clean` remove all node_modules
- `run` just does npm start in an app
