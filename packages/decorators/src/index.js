import createView from 'motion-view'
import { hmrDecorate } from 'motion-hmr'
import gloss from 'gloss'
import mixin from 'react-mixin'
import Helpers from 'motion-class-helpers'
import MobxHelpers from 'motion-mobx-helpers'
import React from 'react'
import { observer } from 'mobx-react'
import baseStyles from './styles'

// mobx decorators
export * from 'mobx'

const styled = gloss({ baseStyles })

// @view decorator
export const view = createView(View => {
  // + extends React.View
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  // + hmr
  mixin(View.prototype, hmrDecorate())
  // + this.setTimeout + this.setInterval + this.addEvent
  mixin(View.prototype, Helpers)
  // + this.react + this.watch
  mixin(View.prototype, MobxHelpers)
  // + gloss + mobx
  return styled(observer(View))
})

// @store decorator
export const store = Store => {
  mixin(Store.prototype, Helpers)
  mixin(Store.prototype, MobxHelpers)
  return Store
}
