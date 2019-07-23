<p align="center">
  <img margin="auto" width="64px" height="64px" src="../master/assets/appicon.png?raw=truepng" />
  <br />
  <b>Orbit</b> - Make amazing apps together.
</p>

## install

Currenly using Node 9.11.1. Run this command:

```sh
yarn bootstrap
```

Bootstrap make sure everything is installed and built. I find the easiest way to add new npm packages to any app/package is to just edit the package.json directly (VSCode will suggest the latest version for you), and then re-run bootstrap.

If you just want to re-build everyhting, try `yarn build`.

## run

Orbit now "self-builds" so you can just run with `yarn start` which runs `orbit ws` inside the `app/example-workspace`.

To run the development tools, run `yarn start:devtools`. This will run two things:

- A [Puppeteer](https://github.com/GoogleChrome/puppeteer) instance that automatically hooks into the REPL for all processes (node, electron and client).
- The [Overmind](https://overmindjs.org/) devtools which let you see the state inside Overmind which we use for mostly global state.

## how this repo is structured

A the high level:

- Code (these folders are all managed by [Lerna](https://github.com/lerna/lerna)):
  - `app` contains Orbit itself, including things that build/debug it.
  - `apps` are individual orbit apps we've built.
  - `packages` contains anything that could run across any app, and are independent of orbit generally.
  - `projects` contains sub-projects like our website and a playground to do light debugging on things.
- Development:
  - `bin` lets you create scripts for the repo that you can run when you `source .env` directly from CLI. useful for more complex monorepo scripting.
  - `scripts` has one-off scripts that you may need for specific actions (like downloading datasets for fixtures).
  - `patches` is for [patch-package](https://github.com/ds300/patch-package), helpful for working around broken node modules
- Others:
  - `assets` has media/images
  - `data` is a temp folder created to store data needed for fixtures
  - `notes` is just markdown files with some notes

What we may want to do is split these a bit further:

1. Make `app` into `orbit-desktop` and move out:
   1. All the cloud APIs into `cloud-api` or similar (registry, api).
   2. All the middleware type things into their own thing (above packages, below orbit-desktop), so we could use them all in mobile apps.
   3. The `mobile` app into it's own top level thing.

```sh
/app
  # for running the main app

  /cli              # CLI, because we may want `orbit` to be CLI + APIs
  /orbit            # empty for now, will eventually be our CLI
  /orbit-app        # web app (webpack, electron loads it)
  /orbit-desktop    # node process (runs server for oauth, runs a variety of backend services)
  /build-server     # used by orbit-desktop to run webpack for apps
  /orbit-electron   # electron process (one-per-window, controls electron windows and other state)
  /orbit-syncers    # workers process, runs the apps node-processes
  /config           # set on startup, config shared by all processes
  /kit              # The public facing APIs for building apps: higher level hooks, views and components that work together
  /kit-internal     # "Private" kit for our internal use
  /models           # TypeORM models, shared by all apps ^^
  /services         # Oauth integration helpers (Github.getRepos, Drive.getFiles...)
  /stores           # Singleton *across all processess*, syncs deep reactive .state
  /orbit-repl       # Runs Puppeteer and hooks into all processes for debugging
  /oracle           # (inactive) OCR for reading screen, light OS level controller
  /model-bridge     # Lets us do observeOne/loadOne/commands/etc between processes
  /libs-node        # Libraries shared by all node processes
  /libs             # Libraries shared by all web processes

  # mobile
  /mobile           # as of now just experiment to get our UI kit running in react-native, on hold until react native better supports things, we should move off haul and onto their own packager once monorepo support.

  # cloud
  /api              # search / registry updating endpoints for publishing apps
  /registry         # verdaccio registry (basically our own npm registry) so we have an index of all orbit apps published

  # some things in ./app are from older attempts, not currently used:
  /oracle           # realtime OCR system for mac desktop
  /screen           # watches your screen for events and runs OCR
  /orbit-dotapp     # experiment on making custom .app icons for each app

/packages           # all packages we maintain
  # note: only documenting interesting packages, the rest extermely minor
  /automagical        # powers react()
  /use-store          # used for all our stores, automatically tracks changes
  /gloss              # our sweet CSS-in-JS solution
  /ui                 # lower level pure UI kit, built with gloss
```

## using the monorepo

Because lerna links things together it can cause some weirdness with installing packages. There are a few ways to do it. All examples start at the root directory.

1.  `install`

```
cd apps/desktop
install randomcolor
```

2. `in`

The `in` command finds the sub-package or app and just cd's into it before doing something. So you can do something like:

```
in desktop install randomcolor
```

likewise you can do other things:

```
in models yarn start
```

3.  modify the package.json directly, and then `bootstrap`:

Bootstrap sort of checks a lot of stuff, but its really fast, so you can generally just modify a lot of package.json's and then run `bootstrap` after.

- `clean` removes built files, `clean --all` also removes node_modules

## Developing Orbit

Once you run orbit with `yarn start` you should be able to develop Orbit either in the Electron app or in Chrome.

To see the app itself in Electron, you hit **"Option+Space"**. That's the default command to open Orbit.

Developing in Chrome is a bit easier, it refreshes more easily and if things freeze you don't have to kill everything. To do so just open [https://localhost:3001](https://localhost:3001).

### The main areas of the app

To understand the client side app you'll want to know the following:

#### How it starts / keeps global state

- `main.tsx > configurations.tsx` - Sets up global variables and other debugging tools in development, configures various packages like the UI kit.
- `main.tsx > om/om.ts` - We use Overmind, abbreviated to om, for our global state. It gives us a really nice state contained that is granular, works with hooks, and lets us derive state and react to state easily. See the `om/onInitiialize`, this will really give you a good overview to see the high level state.
- `main.tsx > OrbitRoot.tsx` - The React entry point
  - `pages/OrbitPage.tsx` - Generally everything goes through here, we used to have a few different apps (HighlightsPage/CosalPage and others), but we don't use them now other than for debugging, and potentially down the road.

We also have some configuration which is shared by *every* process and every client app. It stores things like which ports we are using, common and important paths, and so on. That gets set up by `orbit-main/src/getInitialConfig.ts`.

So how does data stored / loaded from the abckend?

#### How data is stored/synced from the backend

We have a unique and powerful system for managing our data. The important things to know are:

1. We store it in SQLite.
2. That's typically managed by [TypeORM](https://typeorm.io/)
3. The `@o/bridge` package then handles the bridge between the backend and frontend:
   1. The `MediatorServer` and `MediatorClient` classes are a websocket bridge for handling the main communication.
      1. See `save()` and `load/loadOne()` used in places around the stack.
      2. You can also `observe/observeOne()` that returns an Observable stream of any updates.
   2. We then have a Suspense style wrapper around that that makes it easy to query using hooks: `@o/bridge/src/useModel.ts`. This also dedupes the queries and caches values, including optimistic updating.

### `Logger` from @o/logger

In dev mode we expose `Logger` from @o/logger so you can control logs:

```js
LoggerSettings.namespaces // list things that log
LoggerSettings.loud() // log everything, pass argument to narrow
LoggerSettings.quiet() // quiet everything, argument to narrow
```

It may be helpful to run `LoggerSettings.list` and `LoggerSettings.loud()` in each app just to get an idea of what's going on there.

### `debug()` in browser

orbit-app has it's own debugging functionality for debugging the frontend. Use `window.debug()` or just `debug()` to toggle between verbose or silent. It will log out colored outputs of all reactions/updates/actions happening at the store level, which is helpful to see whats going on generally in the app.

```
orange = action
red = update
blue = reaction
```

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

### The root level stores `App`, `Desktop` and `Electron` from `@o/stores`

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
import { App, Desktop, Electron } from '@o/stores'

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
