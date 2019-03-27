import { validCSSAttr } from '@o/css'
import { partitionObject } from '@o/utils'
import { omit } from 'lodash'
import React, { forwardRef } from 'react'
import SVGInline from 'react-svg-inline'

export const SVG = forwardRef<SVGElement, any>(function SVG(
  { width, height, style = null, ...props },
  ref,
) {
  const [styles, rest] = partitionObject(props, x => validCSSAttr[x])
  return (
    <SVGInline
      ref={ref}
      style={{ display: 'flex', width, height, ...styles, ...style }}
      {...omit(rest, 'hoverStyle')}
    />
  )
})
