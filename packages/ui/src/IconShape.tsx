import { IconSvgPaths20 } from '@blueprintjs/icons'
import React, { forwardRef, memo, useEffect, useState } from 'react'
import SVG from 'svg.js'

import { findName, IconProps } from './Icon'
import { View } from './View/View'

export type IconShapeProps = IconProps & {
  shape: 'circle' | 'squircle'
}

const diameter = 28
const radius = diameter / 2

const shapes = {
  squircle: `M11.4846696,-4.56426407e-16 L16.5153304,4.56426407e-16 C20.4637882,-2.68893526e-16 21.929139,0.41771525 23.3958057,1.20209717 C24.8624723,1.98647908 26.0135209,3.13752767 26.7979028,4.60419433 C27.5822847,6.070861 28,7.53621182 28,11.4846696 L28,16.5153304 C28,20.4637882 27.5822847,21.929139 26.7979028,23.3958057 C26.0135209,24.8624723 24.8624723,26.0135209 23.3958057,26.7979028 C21.929139,27.5822847 20.4637882,28 16.5153304,28 L11.4846696,28 C7.53621182,28 6.070861,27.5822847 4.60419433,26.7979028 C3.13752767,26.0135209 1.98647908,24.8624723 1.20209717,23.3958057 C0.41771525,21.929139 1.7926235e-16,20.4637882 -3.04284271e-16,16.5153304 L3.04284271e-16,11.4846696 C-1.7926235e-16,7.53621182 0.41771525,6.070861 1.20209717,4.60419433 C1.98647908,3.13752767 3.13752767,1.98647908 4.60419433,1.20209717 C6.070861,0.41771525 7.53621182,2.68893526e-16 11.4846696,-4.56426407e-16`,
  circle: `M ${radius}, ${diameter}
    a ${radius},${radius} 0 1,1 ${diameter},0
    a ${radius},${radius} 0 1,1 -${diameter},0`,
}

export const IconShape = memo(
  forwardRef(({ shape, style, ...props }: IconShapeProps, ref: any) => {
    const name = findName(props.name)
    const iconPath = (IconSvgPaths20[name] || IconSvgPaths20.home).join(' ')
    const [svgPath, setSVGPath] = useState('')

    useEffect(() => {
      const draw = SVG('empty').size(28, 28)
      const icon = draw.path(iconPath)
      const out = icon
        .size(16, 16)
        .move(6, 6)
        .array()
        .toString()
      setSVGPath(`${shapes[shape]} ${out}`)
    }, [iconPath])

    const scale = props.size / 28
    return (
      <View ref={ref} style={{ ...style, width: props.size, height: props.size }} {...props}>
        <div style={{ display: 'none' }} id="empty" />
        <svg
          width={28}
          height={28}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <g>
            <path d={`${svgPath}`} fill={`${props.color || '#999'}`} />
          </g>
        </svg>
      </View>
    )
  }),
)

// @ts-ignore
IconShape.defaultProps = {
  shape: 'squircle',
}
