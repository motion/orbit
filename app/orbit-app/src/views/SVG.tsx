import * as React from 'react'
import SVGInline from 'react-svg-inline'

export const SVG = React.forwardRef<SVGElement, any>(function SVG(
  { size = 20, style = null, ...props },
  ref,
) {
  return <SVGInline ref={ref} style={{ width: size, height: size, ...style }} {...props} />
})
