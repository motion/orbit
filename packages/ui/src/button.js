import React from 'react'
import SizedSurface from './sizedSurface'

export default ({ badge, children, ...props }) =>
  <SizedSurface
    tagName="button"
    borderWidth={1}
    glint
    row
    align="center"
    glow
    {...props}
    noElement
  >
    {children}
    {badge &&
      <badge>
        {badge}
      </badge>}
  </SizedSurface>
