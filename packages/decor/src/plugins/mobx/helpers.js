// @flow
import * as AllHelpers from '@mcro/helpers'
import { toJS, autorun, autorunAsync, reaction } from 'mobx'

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
  userOptions?: Object | Boolean,
): Function {
  let options = {
    // fast-deep-equals + Mobx value support
    equals: (_a, _b) => {
      const a = _a && _a.$mobx ? toJS(_a) : _a
      const b = _b && _b.$mobx ? toJS(_b) : _b
      return AllHelpers.isEqual(a, b)
    },
  }
  if (userOptions === true) {
    options.fireImmediately = true
  }
  if (userOptions instanceof Object) {
    options = { ...options, ...userOptions }
  }
  const dispose = reaction(fn, onReact.bind(this), options)
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
