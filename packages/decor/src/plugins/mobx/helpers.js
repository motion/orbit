// @flow
import * as Helpers from '@mcro/helpers'
import { autorun, reaction } from 'mobx'

// subscribe-aware helpers
export function watch(fn: Function): Function {
  const dispose = autorun(fn)
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

export default () => ({
  name: 'helpers',
  once: true,
  onlyClass: true,
  decorator: (Klass: Class<any> | Function) => {
    Object.assign(Klass.prototype, {
      ...Helpers,
      watch,
      react,
    })
  },
})
