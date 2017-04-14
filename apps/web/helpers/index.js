import { addEvent, setTimeout, setInterval, ref } from 'motion-class-helpers'
import { watch, react } from 'motion-mobx-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import React from 'react'
import gloss from 'gloss'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { provide } from 'motion-view'
import baseStyles from './baseStyles'

// gloss
export const $ = gloss({ baseStyles })

// Store
export class Store {
  constructor(props) {
    this.props = props
  }
}

// these are all available on every view
const Helpers = {
  addEvent,
  setInterval,
  setTimeout,
  ref,
  watch,
  react,
}

// @view decorator
export function view(View) {
  // extend React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)

  // add Helpers
  mixin(View.prototype, Helpers)

  // render gets props/state/context
  const render = View.prototype.render
  View.prototype.render = function() {
    return render.call(this, this.props, this.state, this.context)
  }

  // order important:
  //   autobind, gloss, mobx
  return autobind($(observer(View)))
}

// for passing stores to views
view.provide = (...args) => View => provide(...args)(view(View))
