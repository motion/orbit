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

# run once to start watching / building everything in a persistent terminal
build --watch

# then, to run the apps you can either do:
run orbit

# or do any number of different ways. i often run webpack separate from the rest
# this lets you see webpack errors more clearly

# in one terminal:
run orbit-app
# in another terminal:
run orbit --no-app
```

There are some run options:

```
run orbit \
  --no-app \       # doesnt run webpack
  --no-electron \  # run without electron, just desktop / syncers
  --no-syncers \   # run without syncers process
  --no-watch \     # dont restart electron on code changes
  --no-logging \   # dont log out a lot (syncers log quite a bit)
  --no-gpu         # dont render electron using gpu
                   # (bcz occasionally you run into glitchy white bgs when debugging)
```

Some run options for orbit-app:

```
# To debug orbit in your web-browser instead of electron:
run orbit-app --target web

# To run orbit-app in prod mode:
run orbit-app --prod
```

## Structure of this repo

```sh
/apps
  /orbit            # entry, forks the orbit-* processes, then require('orbit-electron')
  /orbit-app           # web app (webpack, electron loads it)
  /orbit-desktop       # node app (runs server for oauth, runs a variety of backend services)
  /orbit-electron      # electron app (one-per-window, controls electron windows and other state)
  /orbit-syncers       # syncers app (syncs data from github, slack, etc into the app)
  /models           # TypeORM models, shared by all apps ^^
  /services         # Oauth integration helpers (Github.getRepos, Drive.getFiles...)
  /stores           # Singleton *across all processess*, syncs deep reactive .state
  /orbit-repl       # Runs Puppeteer and hooks into all processes for debugging
  /oracle           # (inactive) OCR for reading screen, light OS level controller
  /model-bridge     # Lets us do observeOne/loadOne/commands/etc between processes

/bin                # monorepo scripts (bootstrap, build, run, deploy, etc)
/notes              # ongoing notes related to project
/packages           # all packages we maintain
  # note: only documenting interesting packages, the rest extermely minor
  /automagical        # powers react()
  /use-store          # used for all our stores, automatically tracks changes
  /gloss              # our sweet CSS-in-JS solution
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

### `log` global in the app

This is a nice helper to log things. It colorizes the output nicely into terminal. It returns the first argument passed into it, so you can easily wrap it in weird places and have it log for you:

```
{
  some: {
    big: [object, of, log(things)]
  }
}

log.full() // will log the entire thing not cut it short
```

### Debugging stores in orbit-app

You can basically inspect a lot of stuff in the running app, check out:

```
# All currently mounted stores:
Stores.* (Stores.OrbitStore, etc)

# State of recent actions in stores:
#StoreState.*

# See granular updates:
window.enableLog = true

# Run commands and load models
Mediator.loadOne(Models.*).then(x => console.log(x))
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

```got an error but may not be worth reporting
await Promise.all(Object.keys(Syncers).map(syncer => Syncers[syncer].start()))
```
