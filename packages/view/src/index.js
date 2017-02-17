import view, { addStoreHMR } from 'motion-view'
import gloss from 'gloss'
import { mix } from 'mixwith'
import { addHelpers } from 'motion-class-helpers'
import React from 'react'

// add styles
const styled = gloss()

const HelpfulComponent = mix(React.Component)
  .with(
    addStoreHMR,
    addHelpers(),
  )

// motion-view is a simple decorator, it passes through the class
export default view(Klass => {
  // add HelpfulComponent
  Object.setPrototypeOf(Klass.prototype, HelpfulComponent.prototype)

  // add gloss
  return styled(Klass)
})
