import React from 'react'
import SizedSurface from './sizedSurface'

export default props =>
  <SizedSurface
    tagName="button"
    borderWidth={1}
    borderStyle="solid"
    hoverable
    glint
    glow
    {...props}
    noElement
  />
