import { watch, react } from 'motion-mobx-helpers'
import {
  on,
  addEvent,
  setTimeout,
  setInterval,
  ref,
} from 'motion-class-helpers'

export default options => ({
  name: 'subscribable-helpers',
  mixin: {
    on: function(a, b, c) {
      return a && a._emitter
        ? on.call(this, a._emitter, b, c)
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
