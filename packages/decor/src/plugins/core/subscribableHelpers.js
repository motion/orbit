// @flow
import { watch, react } from 'motion-mobx-helpers'
import {
  on,
  addEvent,
  setTimeout,
  setInterval,
  ref,
} from 'motion-class-helpers'

export type SubscribableHelpers = {
  on(target: any, name: string, callback: Function): { dispose(): void },
  setInterval(callback: Function): Function,
  setTimeout(callback: Function): Function,
  ref(path: string): { setter: Function, set: Function, toggle: Function },
  watch(callback: Function): { dispose(): void },
  react(watch: Function, callback: Function): { dispose(): void },
}

export default options => ({
  name: 'subscribable-helpers',
  mixin: {
    on: function(a, b, c) {
      return a && a.emitter
        ? on.call(this, a.emitter, b, c)
        : on.call(this, a, b, c)
    },
    addEvent,
    setInterval,
    setTimeout,
    ref,
    watch,
    react,
  },
})
