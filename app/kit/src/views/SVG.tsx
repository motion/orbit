import React, { forwardRef } from 'react'
import SVGInline from 'react-svg-inline'

export const SVG = forwardRef<SVGElement, any>(function SVG(
  { width, height, style = null, ...props },
  ref,
) {
  return <SVGInline ref={ref} style={{ display: 'flex', width, height, ...style }} {...props} />
})
