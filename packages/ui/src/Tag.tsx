import React from 'react'

import { SizedSurface, SizedSurfaceProps } from './SizedSurface'

export const Tag = (props: SizedSurfaceProps) => (
  <SizedSurface
    size={0.9}
    sizeRadius={0.9}
    sizeFont
    sizePadding
    sizeHeight
    sizeLineHeight
    WebkitAppRegion="no-drag"
    flexDirection="row"
    borderWidth={0}
    justifyContent="center"
    {...props}
  />
)
