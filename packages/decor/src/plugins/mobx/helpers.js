// @flow
import * as AllHelpers from '@mcro/helpers'
import { autorun, reaction } from 'mobx'

// subscribe-aware helpers
export function watch(fn: Function): Function {
  const dispose = autorun(fn.bind(this))
  this.subscriptions.add(dispose)
  return dispose
}

export function react(
  fn: Function,
  onReact: Function,
  immediately: boolean = false
): Function {
  const dispose = reaction(fn, onReact, immediately)
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
