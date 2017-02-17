import gloss from 'gloss'
import { mix } from 'mixwith'
import { addHelpers } from 'motion-class-helpers'
import React from 'react'

// add styles
const styled = gloss()

const HelpfulComponent = mix(React.Component)
  .with(
    addHelpers
  )

// @view decorator
export default Klass => {
  // auto extend HelpfulComponent
  Object.setPrototypeOf(Klass.prototype, HelpfulComponent.prototype)

  // add gloss
  return styled(Klass)
}
