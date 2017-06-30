import React from 'react'
import SizedSurface from './sizedSurface'

export default props =>
  <SizedSurface
    tagName="button"
    borderWidth={1}
    hoverable
    glint
    glow
    {...props}
    noElement
  />
