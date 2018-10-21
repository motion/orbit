import * as React from 'react'
import SVGInline from 'react-svg-inline'

export const SVG = ({ size = 20, style = null, ...props }) => (
  <SVGInline style={{ width: size, height: size, ...style }} {...props} />
)
