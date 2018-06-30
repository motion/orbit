```ts
import { store } from 'black'
import { SomeOtherStore } from './SomeOtherStore'

// 1. need to fix using constructor() as well in stores naturally

@store({
  autoStart: false,
})
class MyStore {
  // @store should auto handle disposing it
  otherStore = new SomeOtherStore()

  async didMount() {
    await somethingElse()
    this.someReaction.start()

    // some way to pause a store?
    this.pause()
  }

  someReaction = react(
    () => this.otherStore.val
    () => {
      // ...
    }
  )
}
```
