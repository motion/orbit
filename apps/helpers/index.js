import { addEvent, setTimeout, setInterval, ref, isClass } from 'motion-class-helpers'
import { watch, react, observeStreams } from 'motion-mobx-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import React from 'react'
import gloss from 'gloss'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { provide } from 'motion-view'
import baseStyles from './baseStyles'

export const glossy = gloss({ baseStyles })

// these are all available on every view
const Helpers = {
  addEvent,
  setInterval,
  setTimeout,
  ref,
  watch,
  react,
}

export function view(View) {
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  mixin(View.prototype, Helpers)

  // render
  const render = View.prototype.render
  View.prototype.render = function() {
    return render.call(this, this.props, this.state, this.context)
  }

  // order important
  return autobind(glossy(observer(View)))
}

view.provide = (...args) => View => provide(...args)(view(View))

export function store(Store) {
  if (isClass(Store)) {
    mixin(Store.prototype, Helpers)
    return autobind(Store)
  }
  return observable(observeStreams(Store))
}
