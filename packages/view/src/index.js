import createView from 'motion-view'
import { hmrDecorate } from 'motion-hmr'
import gloss from 'gloss'
import mixin from 'react-mixin'
import Helpers from 'motion-class-helpers'
import MobxHelpers from 'motion-mobx-helpers'
import React from 'react'
import { observer } from 'mobx-react'
import baseStyles from './styles'

const styled = gloss({ baseStyles })

// @view decorator
export default createView(Component => {
  // + extends React.Component
  Object.setPrototypeOf(Component.prototype, React.Component.prototype)
  // + hmr
  mixin(Component.prototype, hmrDecorate())
  // + this.setTimeout + this.setInterval + this.addEvent
  mixin(Component.prototype, Helpers)
  // + this.react + this.watch
  mixin(Component.prototype, MobxHelpers)
  // + gloss + mobx
  return styled(observer(Component))
})
