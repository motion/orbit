import view from 'motion-view'
import { StoreHMR } from 'motion-hmr'
import gloss from 'gloss'
import reactMixin from 'react-mixin'
import Helpers from 'motion-class-helpers'
import React from 'react'

const styled = gloss()

// @view decorator
export default view(Klass => {
  // auto-extend React.Component
  Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
  // mixins
  reactMixin(Klass.prototype, StoreHMR)
  reactMixin(Klass.prototype, Helpers)
  // gloss
  return styled(Klass)
})
