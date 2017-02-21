import React from 'react'
import gloss from 'gloss'
import mixin from 'react-mixin'
import motionView from 'motion-view'
import autobind from 'autobind-decorator'
import { addEvent, setTimeout, setInterval, ref } from 'motion-class-helpers'
import { watch, react } from 'motion-mobx-helpers'
import { observer } from 'mobx-react'
import baseStyles from './styles'

// mobx decorators
export * from 'mobx'
// gloss
export const glossy = gloss({ baseStyles })
const classHelpers = {
  addEvent,
  setTimeout,
  setInterval,
  ref,
  watch,
  react,
}

const { decorator } = motionView()

// @view
export const view = decorator(View => {
  // extends React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  // mixins
  mixin(View.prototype, classHelpers)
  // gloss, mobx
  return glossy(observer(View))
})

// @store
export function store(Store) {
  mixin(Store.prototype, classHelpers)
  return autobind(Store)
}
