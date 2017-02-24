import mv from 'motion-view'
import { addEvent, setTimeout, setInterval, ref, isClass } from 'motion-class-helpers'
import { watch, react } from 'motion-mobx-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import React from 'react'
import gloss from 'gloss'
import { observer } from 'mobx-react'
import baseStyles from './baseStyles'

// glossy
export const glossy = gloss({ baseStyles })

export const { provide, inject, decorate } = mv()
const ClassHelpers = { addEvent, setInterval, setTimeout, ref, watch, react }

// view
export function view(View) {
  // extends React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)

  // mixins
  mixin(View.prototype, ClassHelpers)

  // render
  const render = View.prototype.render
  View.prototype.render = function() {
    return render.call(this, this.props, this.state, this.context)
  }

  // hmr, autobind, gloss, mobx (order important)
  return decorate(autobind(glossy(observer(View))))
}

view.provide = provide

// store
export function store(Store) {
  mixin(Store.prototype, ClassHelpers)
  let res = decorate(Store)
  if (isClass(Store)) {
    res = autobind(res)
  }
  return res
}
