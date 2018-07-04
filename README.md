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
/debug              # simple logger - require('@mcro/debug')('myApp')('hello world')
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

### `debug` from @mcro/debug

In dev mode we expose `debug` from @mcro/debug so you can control logs:

```js
debug.list() // list things that log
debug.loud() // log everything, pass argument to narrow
debug.quiet() // quiet everything, argument to narrow
```

It may be helpful to run `debug.list()` and `debug.loud()` in each app just to get an idea of what's going on there.

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

### TypeORM Models from `@mcro/models`

In dev mode we set up models to be globals so you can use them easily in REPL as well. So for now `Bit`, `Setting`, `Person`, and `Job`.

```js
await Bit.find()
```

## Store/View abstractions

We have a simple system for building compiled aggregated decorators called `@mcro/decor`. With it we put together two main decorators (`@store` and `@view`), which are both in defined in `@mcro/black`.

### Views with `@view`

See `@mcro/black/view`. Basically has:

- Add `this.subscriptions` using npm `event-kit` so you can avoid messy tracking on cpWU
- Add props as the first argument to `render()`, so you can do `render({ children })`
- Add `mobx-react` automatically
- Adds gloss

Most of this is really simple. The only interesting thing for views is the style system. It uses our own, which is called Gloss. See [the gloss README.md](packages/gloss/README.md) for details.

Basically gloss gives you a nice style system that just works:

```js
import { view } from '@mcro/black'

@view
class MyView {
  render({ color = 'green' }) {
    return (
      <section>
        <h1 $alternate $color={color} css={{ fontWeight: 500 }}>
          Hello World
        </h1>
      </section>
    )
  }
  static style = {
    section: { background: [0, 0, 0] }, // black
    h1: { background: 'green' },
    alternate: { background: 'red' },
    color: color => ({ color }),
  }
}
```

There's also `@view.ui` for leaf-views. The only diff is it just doesn't wrap `mobx-react`, which may be heavy for simple views.

### Stores with `@store` and `react`

Stores are just classes. The `@store` decorator will automatically mobx decorate them for you. This is essentially exactly what Mobx 5 `decorate`. It also has a few of the same `@mcro/decor` plugins with the same ideas:

- Add `willMount()` `didMount()` and `willUnmount()` for when using with views
- Adds some hmr and other nice stuff

The big thing here is `react`, which is really the only unique thing here beyond minor helpers, and really is the most powerful part of the kit. It's essentially Mobx `reaction`, but we found ourselves repeating and adding tons of boilerplate for many things, which `react` simplifies into one thing. Here's `react` in a nutshell, [see the automagical README.md](packages/automagical/README.md) for more information.

```js
import { store, react } from '@mcro/black'

@store
class MyStore {
  val = 0

  // automatically decorated into Mobx.computed
  get calculatedVal() { return this.val + 1 }

  // automatically turned into a named action, `MyStore.increment`
  increment(by = 1) { this.val += by }

  valAfterASecond = react(
    () => this.val,
    async (val, { sleep } => {
      await sleep(1000)
      return val
    }
  )

  describeState = react(
    () => this.val,
    async (val, { when, setValue }) => {
      if (val !== this.valAfterASecond) {
        setValue('Not in sync')
        await when(() => val === this.valAfterASecond)
        setValue('In sync!')
      }
    },
    { defaultValue: 'Just started' }
  )
}
```

### Attaching stores to views with `@view()`, `@view.provide` and `@view.attach`

This is the final piece, which ties the two together (importantly). You can attach a store easily to a view with either of the above. The only difference is `provide` will also pass the store through context, and likewise `@view.attach` will attach it back. As a convenience, the store attach. We need to make these better typed and not use strings, but for now they are like so.

```js
@view({
  store: class MyStore {
    title = 'hello world'
  },
})
class MyView extends React.Component {
  render({ store }) {
    return <div>{store.title}</div>
  }
}
```

Or to pass it down long distance:

```js
@view.provide({
  storeName: class MyStore {
    title = 'hello world'
  },
})
@view
class MyView extends React.Component {
  render({ storeName }) {
    return (
      <div>
        {storeName.title}
        <SubStore />
      </div>
    )
  }
}

@view.attach('storeName')
@view
class SubStore extends React.Component {
  render({ storeName }) {
    return <div>I can read too: {storeName.title}</div>
  }
}
```
