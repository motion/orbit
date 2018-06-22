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

## Developing

In each app you have a few things. Here are some globals:

### debug from @mcro/debug

The global `debug` is set. This lets you control logs.

```js
debug.list() // list things that log
debug.loud() // log everything, pass argument to narrow
debug.quiet() // quiet everything, argument to narrow
```

It may be helpful to run `debug.list()` and `debug.loud()` in each app just to get an idea of what's going on there.

### log from @black/helpers/log

This is a nice helper function. It returns whatever is passed into it, so you can easily wrap it in weird places and have it log for you:

```
{
  some: {
    big: [object, of, log(things)]
  }
}
```

It will also colorful log by default, and prevent massive blocks of text. It tries to stringify things recursively, etc.

```
log.full() // will log the entire thing not cut it short
```

### mlog from @black/mlog

This is a mobx logger. Use it like so:

```js
mlog(() => Desktop.state.hoverState) // Because Desktop.state is reactive, this will log whenever it changes
mlog.clear() // stop logging things
```

Saves you from typing:

```js
const off = Mobx.autorun(() => console.log(Desktop.state.hoverState))
off()
```

### require

In web app, you can do `require` from the console. Also see `installDevTools` for other helpers.

### Root

Every app exports it's base level View or Class as Root. In web you can do:

```js
Root.stores // Every mounted store attached to any view
```

In desktop you can do

```js
Root.sync.gdocs.runAll() // run the gdocs syncer
```

### App, Desktop, Electron

These are the base singleton stores that contain the app state synced between every app. This is really nice to have in the REPL.

These all have a special `state` object that syncs across to all the others.

So if you do this in the web app:

```js
App.setState({ query: 'Hello world' })
```

You'll be able to run this instantly in the Desktop or Electron REPL:

```js
App.state.query === 'Hello world'
```

Apps can only set their own state and it syncs to the other apps. They can also send pre-defined messages to each other.

```js
import { App, Desktop, Electron } from '@mcro/stores'

App.messages // list of messages it supports

// in Desktop
Desktop.sendMessage(App, App.messages.TOGGLE_SHOWN)

// in App
App.sendMessage(Electron, Electron.messages.SOME_MESSAGE, 'hello world')
```

### The Models

We set up models to be globals so you can use them easily in REPL as well. So for now `Bit`, `Setting`, `Person`, and `Job`.
