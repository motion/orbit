import { px, validCSSAttr } from '@o/css'
import { partitionObject } from '@o/utils'
import { omit } from 'lodash'
import React, { forwardRef } from 'react'
import SVGInline from 'react-svg-inline'

export const SVG = forwardRef<SVGElement, any>(function SVG(
  { width, height, svg, style = null, ...props },
  ref,
) {
  const [styles, rest] = partitionObject(props, x => validCSSAttr[x])
  if (typeof svg !== 'string') {
    throw new Error(`Invalid svg given: ${svg}`)
  }
  return (
    <SVGInline
      ref={ref}
      svg={svg}
      width={px(width)}
      height={px(height)}
      style={{ display: 'flex', width, height, ...styles, ...style }}
      {...omit(rest, 'hoverStyle', 'subTheme')}
    />
  )
})
