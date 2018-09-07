# automagical

Automagical is a light layer over Mobx that automatically turns classes into Mobx stores. As of Mobx 5 a lot of automagical was basically implemented in Mobx core under the `decorate` function and so it was simplified.

What automagical does give you is the ability to really easily do reactions. Before in Mobx you'd have to do quite a bit to set up a well-structured reaction. Here's a contrived example:

```js
class MyStore {
  val = 0
  val2 = 0

  constructor() {
    const dispose = Mobx.reaction(
      () => this.val,
      val => {
        this.val2 = val + 1
        // and if you want async stuff that cancels on next reaction, good luck...
      },
      {
        // have to set this to get a nice log
        name: `MyStore.reactToVal`,
      },
    )
    // have to handle dispose manually each time
    this.subscriptions.add({ dispose })
  }
}
```

With automagical + react, you can do this:

```js
class MyStore {
  val = 0

  // this will also log as MyStore.val2 automatically
  val2 = react(
    () => this.val,
    // react() stores this value to the class property
    val => val + 1,
  )
}
```

This is nice, but pretty simple. It saves a lot of code though in the long run. But the real value comes with some of the features we've put together over time using react.

### Asynchronous reactions

The second you want to do something asynchronous with Mobx you're forced to put together a variety of reptitive and brittle logic to track what's going on. With react you have a lot less to think about.

First, you can just use async functions and it handles when they re-run automatically:

```js
class MyStore {
  val = react(
    () => Mobx.now(2000),
    async () => {
      // if this takes longer than 2000, no worries, it will cancel and use the next fetch!
      return await fetch('/something')
    },
  )
}
```

What if you want to sleep a bit during typing?

```js
class MyStore {
  query = ''
  answer = react(
    () => this.query,
    async (query, { sleep }) => {
      // really nice debouncing
      await sleep(100)
      return await fetch(`/search?q=${query}`)
    },
  )
}
```

Or wait for some things to be true?

```js
class MyStore {
  query = ''
  serverResults = react(
    () => this.query,
    query => ({ query, answer: (await fetch(query)) })
  )
  localResults = react(
    () => this.query,
    query => ({ query, answer: (await someLocalQuery(query)) })
  )
  allResults = react(
    () => this.query,
    async (query, { when, sleep }) => {
      await when(() => this.localResults.query === query)
      await when(() => this.serverResults.query === query, 200)
      await sleep(100)
      return [...this.localResults.answer, ...this.serverResults.answer]
    }
  )
}
```

Internally these helper functions throw a special value that is caught and handled properly. When the reaction re-runs it also ignores and throws after the last async function.

You can also do your own cancels. This will prevent the reaction from logging as a success, so you can debug just "valid" reactions, which is helpful as your app grows:

```js
class MyStore {
  val = react(
    () => this.something,
    () => {
      ensure('something', somethingIsTrue)
      return Math.random()
    },
  )
}
```

There is also a `whenChanged` helper which is like `when` but continues once the value changes at all.

## Multiple updates

Finally, you can multiple-updates, where you set a value multiple times over the course of a reaction:

```js
class MyStore {
  val = react(
    () => this.someEvent,
    async (_, { sleep, setValue }) => {
      setValue('loading')
      await sleep(100)
      setValue('done loading')
    },
  )
}
```

Note: you can't mix `setValue` and using `return` to return a value. Automagical will throw an error if it detects this.

Similarly, `getValue` exists which helps out when abstracting react functions. Otherwise you can get the current value usually by just referencing the variable name within the reaction.

### todo

Document:

- ReactionOptions
  - delayValue
  - onlyUpdateIfChanged
