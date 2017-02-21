import React from 'react'
import gloss from 'gloss'
import mixin from 'react-mixin'
import motionView from 'motion-view'
import autobind from 'autobind-decorator'
import { observer } from 'mobx-react'
import baseStyles from './baseStyles'
import * as ClassHelpers from './classHelpers'

// mobx decorators
export * from 'mobx'
// gloss
export const glossy = gloss({ baseStyles })

// @view
export const view = motionView(View => {
  // extends React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  // mixins
  mixin(View.prototype, ClassHelpers)
  // autobin, gloss, mobx (order important)
  return autobind(glossy(observer(View)))
})
