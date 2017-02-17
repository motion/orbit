import createView from 'motion-view'
import { hmrDecorate } from 'motion-hmr'
import gloss from 'gloss'
import mixin from 'react-mixin'
import Helpers from 'motion-class-helpers'
import React from 'react'
import baseStyles from './styles'

const styled = gloss({ baseStyles })

// @view decorator
export default createView(Component => {
  // auto React.Component
  Object.setPrototypeOf(Component.prototype, React.Component.prototype)
  // mixins
  mixin(Component.prototype, hmrDecorate())
  mixin(Component.prototype, Helpers)
  // gloss
  return styled(Component)
})
