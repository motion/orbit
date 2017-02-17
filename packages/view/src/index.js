import view from 'motion-view'
import { StoreHMR } from 'motion-hmr'
import gloss from 'gloss'
import mixin from 'react-mixin'
import Helpers from 'motion-class-helpers'
import React from 'react'
import baseStyles from './styles'

const styled = gloss({ baseStyles })

// @view decorator
export default view(Klass => {
  // auto React.Component
  Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
  // mixins
  mixin(Klass.prototype, StoreHMR)
  mixin(Klass.prototype, Helpers)
  // gloss
  return styled(Klass)
})
