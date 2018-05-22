import * as AllHelpers from '@mcro/helpers'
import { autorun, autorunAsync, reaction } from 'mobx'

// subscribe-aware helpers
export function watch(fn, userOptions) {
  const runner = autorun(
    fn.bind(this),
    AllHelpers.getReactionOptions(userOptions),
  )
  this.subscriptions.add(runner)
  return runner
}

export function react(fn, onReact, userOptions) {
  const dispose = reaction(
    fn,
    onReact.bind(this),
    // @ts-ignore
    AllHelpers.getReactionOptions(userOptions),
  )
  this.subscriptions.add(dispose)
  return dispose
}

export function reactable() {
  return {
    name: 'mobx-reactable',
    once: true,
    onlyClass: true,
    decorator: Klass => {
      Object.assign(Klass.prototype, {
        ...AllHelpers,
        watch,
        react,
      })
    },
  }
}
