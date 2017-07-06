// @flow
import * as Helpers from '@mcro/helpers'
import { autorun, reaction } from 'mobx'

// subscribe-aware helpers
export function watch(fn): Function {
  const dispose = autorun(fn)
  this.subscriptions.add(dispose)
  return dispose
}

export function react(fn, onReact, immediately = false): Function {
  const dispose = reaction(fn, onReact, immediately)
  this.subscriptions.add(dispose)
  return dispose
}

export default () => ({
  name: 'helpers',
  mixin: {
    ...Helpers,
    watch,
    react,
  },
})
