import gloss from 'gloss'
import reactMixin from 'react-mixin'
import { mix, Mixin } from 'mixwith'
import { inherit as addHelpers, CompositeDisposable } from 'motion-class-helpers'
import React from 'react'

// add styles
const styled = gloss()

// add helpers
const HelpfulClass = Mixin(Parent => {
  class Decorated extends Parent {
    constructor(...args) {
      super(...args)
      this.subscriptions = new CompositeDisposable()
    }
    componentWillUnmount() {
      super.componentWillUnmount && super.componentWillUnmount()
      this.subscriptions.dispose()
    }
  }

  // see motion-class-helpers
  addHelpers(Decorated, 'addEvent', 'setTimeout', 'setInterval', 'ref')

  return Decorated
})

export const Component = mix(React.Component).with(HelpfulClass)

// @view decorator
export default Klass => {
  // inheret our Helpful React Component
  Object.setPrototypeOf(Klass.prototype, Component.prototype)

  // add gloss
  return styled(Klass)
}
