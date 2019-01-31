import * as React from 'react'
import SVGInline from 'react-svg-inline'

export function SVG({ size = 20, style = null, ...props }) {
  return <SVGInline style={{ width: size, height: size, ...style }} {...props} />
}
