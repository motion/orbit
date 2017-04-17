import { addEvent, setTimeout, setInterval, ref } from 'motion-class-helpers'
import { watch, react } from 'motion-mobx-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import React from 'react'
import { observer } from 'mobx-react'
import { provide } from 'motion-view'
import glossy from './styles'

// @view
export default function view(View) {
  // extend React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)

  // add Helpers
  mixin(View.prototype, {
    addEvent,
    setInterval,
    setTimeout,
    ref,
    watch,
    react,
  })

  // order important:
  //   autobind, gloss, mobx
  return autobind(glossy(observer(View)))
}

// @view.provide
view.provide = (...args) => View => provide(...args)(view(View))
