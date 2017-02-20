import React from 'react'
import gloss from 'gloss'
import mixin from 'react-mixin'
import viewHelpers, { componentWillMount } from 'motion-view'
import { addEvent, setTimeout, setInterval, ref } from 'motion-class-helpers'
import { watch, react } from 'motion-mobx-helpers'
import { observer } from 'mobx-react'
import baseStyles from './styles'

// mobx decorators
export * from 'mobx'
// gloss
export const glossy = gloss({ baseStyles })
// view helpers
const { provide, inject } = viewHelpers()

const classHelpers = {
  addEvent,
  setTimeout,
  setInterval,
  ref,
  watch,
  react,
}

// @view
export function view(View) {
  // extends React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  // mixins
  mixin(View.prototype, classHelpers)
  mixin(View.prototype { componentWillMount })
  // gloss, mobx
  return glossy(observer(View))
}

view.provide = provide(view)
view.inject = inject(view)

// @store
export function store(Store) {
  mixin(Store.prototype, classHelpers)
  return Store
}
