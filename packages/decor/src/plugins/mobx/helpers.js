// @flow
import * as AllHelpers from '@mcro/helpers'
import { autorun, autorunAsync, reaction } from 'mobx'

// subscribe-aware helpers
export function watch(fn: Function, debounce): Function {
  let runner
  if (typeof debounce === 'number') {
    runner = autorunAsync(fn.bind(this))
  } else {
    runner = autorun(fn.bind(this))
  }
  this.subscriptions.add(runner)
  return runner
}

export function react(
  fn: Function,
  onReact: Function,
  immediately: boolean = false,
): Function {
  const dispose = reaction(fn, onReact.bind(this), immediately)
  this.subscriptions.add(dispose)
  return dispose
}

export type Helpers = AllHelpers & {
  react: typeof react,
  watch: typeof watch,
}

export default () => ({
  name: 'helpers',
  once: true,
  onlyClass: true,
  decorator: (Klass: Class<any> | Function) => {
    Object.assign(Klass.prototype, {
      ...AllHelpers,
      watch,
      react,
    })
  },
})
