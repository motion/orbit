import React from 'react'
import SizedSurface from './sizedSurface'

export default ({ badge, children, ...props }) =>
  <SizedSurface
    tagName="button"
    borderWidth={1}
    glint
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
