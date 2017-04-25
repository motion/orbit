import {
  addEvent,
  setTimeout,
  setInterval,
  ref,
  CompositeDisposable,
} from 'motion-class-helpers'
import { watch, react } from 'motion-mobx-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import React from 'react'
import { observer } from 'mobx-react'
import { provide } from 'motion-view'
import glossy from './styles'

const Helpers = {
  componentWillMount() {
    this.subscriptions = new CompositeDisposable()
  },
  componentWillUnmount() {
    this.subscriptions.dispose()
  },
  addEvent,
  setInterval,
  setTimeout,
  ref,
  watch,
  react,
}

// @view
export default function view(View) {
  // shorthand for providing stores to view
  if (typeof View === 'object') {
    return view.provide(View)
  }

  // extend React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  Object.setPrototypeOf(View, React.Component)

  // add Helpers
  mixin(View.prototype, Helpers)

  // pass props/context to render
  const or = View.prototype.render
  View.prototype.render = function() {
    return or.call(this, this.props, this.state, this.context)
  }

  // order important: autobind, gloss, mobx
  return autobind(glossy(observer(View)))
}

// @view.provide
view.provide = (...args) => View => provide(...args)(view(View))
