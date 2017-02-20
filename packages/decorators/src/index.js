import React from 'react'
import gloss from 'gloss'
import mixin from 'react-mixin'
import { inject, provide } from 'motion-view'
import { viewHMR } from 'motion-hmr'
import { addEvent, setTimeout, setInterval, ref } from 'motion-class-helpers'
import { watch, react } from 'motion-mobx-helpers'
import { observer } from 'mobx-react'
import baseStyles from './styles'

// mobx decorators
export * from 'mobx'

// gloss
const styled = gloss({ baseStyles })

// view hmr hook
const { componentWillMount } = viewHMR()

// @view decorator
export const view = (View: Function | string, styles: ?Object) => {
  // view() shorthand
  if (typeof View === 'string') {
    const tag = View
    return styled(tag, { [tag]: styles })
  }
  // extend React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  // mixins
  mixin(View.prototype, { inject, provide })
  mixin(View.prototype, { componentWillMount })
  mixin(View.prototype, { addEvent, setTimeout, setInterval, ref })
  mixin(View.prototype, { watch, react })
  // gloss, mobx
  return styled(observer(View))
}

// @store decorator
export const store = Store => {
  mixin(Store.prototype, Helpers)
  mixin(Store.prototype, { watch, react })
  return Store
}
