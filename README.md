## install

Currenly using Node 9.11.1.

First time:

```sh
# bootstrap will ensure a couple deps from brew are installed, requires homebrew
brew update
bin/bootstrap
# only need to do this once to get everything built out
build
```

## run

```sh
# once per shell (or use dotenv)
source .env
# run once to start building all sub packages and apps
build --watch
# run the three apps
run desktop
run app
run electron
```

## Structure of this repo

```sh
/apps               # top level apps
  /app              # web app (webpack, electron loads it)
  /desktop          # node app (syncers, oauth server, ...)
  /electron         # electron app (very light for now, powered by reactron)
  /models           # TypeORM models, shared by all apps ^^
  /oracle           # Swift, gives us deep hooks into OS state
  /services         # Oauth integration helpers (Github.getRepos, GDrive.getFiles...)
  /site             # public facing website
  /stores           # Singleton top level stores, one per app (App, Desktop, Electron)

/assets             # various files for design elements, etc

/bin                # monorepo scripts (bootstrap, build, run, deploy, etc)

/notes              # ongoing notes related to project

/packages           # all packages we maintain

# note: only documenting interesting packages, the rest extermely minor

/automagical        # powers @store and react()
/black              # compiles and exports @view and @store decorator
/constants          # shared static variables between apps
/crawler            # website crawler for custom search
/debug-apps         # the Chromium app that gives us REPL into every app
/gloss              # our CSS-in-JS solution, see README
/reactron           # fork of react-ionize with more features and up to date React
/ui                 # our UI kit, built with gloss
```

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

3.  modify the package.json directly, and then:

```
bootstrap
```

Bootstrap sort of checks a lot of stuff, but its really fast, so you can generally just modify a lot of package.json's and then run `bootstrap` after.

### Other commands

- `clean` remove all node_modules
- `run` just does npm start in an app

## Developing / REPL tools

When you start the apps you'll see a Chromium instance pop up and hook into each running app. Right now there are three: Desktop (Node), Electron, and App (Web). They share a few small helpers:

### `Logger` from @mcro/logger

In dev mode we expose `Logger` from @mcro/logger so you can control logs:

```js
LoggerSettings.namespaces // list things that log
LoggerSettings.loud() // log everything, pass argument to narrow
LoggerSettings.quiet() // quiet everything, argument to narrow
```

It may be helpful to run `LoggerSettings.list` and `LoggerSettings.loud()` in each app just to get an idea of what's going on there.

### `log` from @mcro/black

This is a nice helper to log things. It returns the first argument passed into it, so you can easily wrap it in weird places and have it log for you:

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

### `mlog` from @mcro/black

This is a mobx logger we have just becausse we used this pattern so often. Use it like so:

```js
mlog(() => Desktop.state.hoverState) // Because Desktop.state is reactive, this will log whenever it changes
mlog.clear() // stop logging things
```

Saves you from typing:

```js
const off = Mobx.autorun(() => console.log(Desktop.state.hoverState))
off()
```

### `require`

In the web app, you can do `require` from the console. Also see `installDevTools` for other helpers.

### `Root`

Every app exports it's base level View or Class as Root. In web you can do:

```js
Root.stores // to access every mounted store attached to any view
```

In desktop you can do, for example:

```js
Root.sync.gdocs.runAll() // run the gdocs syncer
```

### The root level stores `App`, `Desktop` and `Electron` from `@mcro/stores`

These are the base singleton stores that contain the app state for each app. The `.state` part of these stores is synced between every app. This is really nice to have in the REPL.

A quick example of how they work. So if you do this in the web app:

```js
App.setState({ query: 'Hello world' })
App.state.query === 'Hello world'
```

You'll be able to run this instantly in the Desktop or Electron REPL as well:

```js
// in Desktop or Electron
App.state.query === 'Hello world'
```

Apps can only set their own state. They can also send pre-defined messages to each other. See `X.messages` for each store to see. It's recommended to check out the three stores to get an idea for what state they manage.

```js
// Message example
import { App, Desktop, Electron } from '@mcro/stores'

App.messages // list of messages it supports

// in Desktop
Desktop.sendMessage(App, App.messages.TOGGLE_SHOWN)

// in App
App.sendMessage(Electron, Electron.messages.SOME_MESSAGE, 'hello world')
```

### Syncers

You can manually stop/run any syncers using REPL.

To start any syncer you can use following command:

```
await Syncers.[SyncerName].start()
```

To stop any syncer you can use following command:

```
await Syncers.[SyncerName].stop()
```

To reset any syncer you can use following command:

```
await Syncers.[SyncerName].reset()
```

To apply same operations on multiple syncers you can use following pattern:

```
await Promise.all(Object.keys(Syncers).map(syncer => Syncers[syncer].start()))
```

### TypeORM Entities

In dev mode we set up models to be globals so you can use them easily in REPL as well.
You can use any entity from `app/orbit-desktop/src/entities` and use it in the REPL following way:

```js
await BitEntity.find()
```
