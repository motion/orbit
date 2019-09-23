import { toColor } from '@o/color'
import { IconSvgPaths20 } from '@o/icons'
import { useTheme } from 'gloss'
import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import SVG from 'svg.js'

import { whenIdle } from './helpers/whenIdle'
import { findName, IconProps } from './Icon'
import { View } from './View/View'

export type IconShapeProps = Omit<IconProps, 'width' | 'height'> & {
  active?: boolean
  shape?: 'circle' | 'squircle'
  gradient?: string[]
  cutout?: boolean
  shapeColor?: string
}

const diameter = 28
const radius = diameter / 2

const shapes = {
  squircle: `M11.4846696,-4.56426407e-16 L16.5153304,4.56426407e-16 C20.4637882,-2.68893526e-16 21.929139,0.41771525 23.3958057,1.20209717 C24.8624723,1.98647908 26.0135209,3.13752767 26.7979028,4.60419433 C27.5822847,6.070861 28,7.53621182 28,11.4846696 L28,16.5153304 C28,20.4637882 27.5822847,21.929139 26.7979028,23.3958057 C26.0135209,24.8624723 24.8624723,26.0135209 23.3958057,26.7979028 C21.929139,27.5822847 20.4637882,28 16.5153304,28 L11.4846696,28 C7.53621182,28 6.070861,27.5822847 4.60419433,26.7979028 C3.13752767,26.0135209 1.98647908,24.8624723 1.20209717,23.3958057 C0.41771525,21.929139 1.7926235e-16,20.4637882 -3.04284271e-16,16.5153304 L3.04284271e-16,11.4846696 C-1.7926235e-16,7.53621182 0.41771525,6.070861 1.20209717,4.60419433 C1.98647908,3.13752767 3.13752767,1.98647908 4.60419433,1.20209717 C6.070861,0.41771525 7.53621182,2.68893526e-16 11.4846696,-4.56426407e-16`,
  circle: `M ${radius}, ${diameter} a ${radius},${radius} 0 1,1 ${diameter},0 a ${radius},${radius} 0 1,1 -${diameter},0`,
}

const cache = {}

export const IconShape = memo(
  ({
    shape = 'squircle',
    gradient,
    size = 28,
    cutout,
    background,
    shapeColor,
    ...props
  }: IconShapeProps) => {
    let iconPath = ''
    const id = useRef(`icon-${Math.round(Math.random() * 100000)}`).current
    const gradientId = `gradient-${id}`

    if (props.name) {
      const name = findName(props.name)
      if (IconSvgPaths20[name]) {
        iconPath = (IconSvgPaths20[name] || IconSvgPaths20.dot).join(' ')
      }
    }

    const [svgPathRaw, setSVGPath] = useState('')
    const svgPath = svgPathRaw || cache[iconPath]

    useEffect(() => {
      if (!iconPath) return
      if (cache[iconPath]) {
        return
      }

      // TODO move this off thread - this interrupts carousel animation
      let cancelled = false
      whenIdle().then(() => {
        if (cancelled) return
        const draw = SVG(id).size(diameter, diameter)
        const icon = draw.path(iconPath)
        const out = icon
          // TODO if its not a perfect square we need to adjust here
          .size(16, 16)
          .move(6, 6)
          .array()
          .toString()

        cache[iconPath] = `${shapes[shape]} ${out}`
        setSVGPath(cache[iconPath])
      })

      return () => {
        cancelled = true
      }
    }, [id, iconPath])

    const scale = size / 28
    const theme = useTheme({
      ignroeCoat: true,
    })

    const themeColor = theme.iconFillColor || theme.color
    const colorLightness = toColor(gradient[0] || themeColor).lightness()

    let color = !!gradient ? `url(#${gradientId})` : `${themeColor.toString()}`

    return (
      <View width={size} height={size} position="relative" {...props}>
        <div style={{ display: 'none' }} id={id} />
        {props.active && (
          <View
            position="absolute"
            top={1}
            right={1}
            bottom={1}
            left={1}
            zIndex={0}
            borderRadius={size / 3.2}
            boxShadow={[[0, 0, 0, 3, theme.coats.selected['background']]]}
          />
        )}
        {!cutout && (
          <View
            position="absolute"
            top={1}
            right={1}
            bottom={1}
            left={1}
            zIndex={0}
            borderRadius={size / 3.2}
            background={shapeColor || (colorLightness > 40 ? '#000' : '#fff')}
          />
        )}
        <svg
          width={28}
          height={28}
          style={{
            transformOrigin: 'top left',
            transform: `scale(${scale}) translateZ(0)`,
            overflow: 'visible',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {!!gradient && (
            <defs>
              <linearGradient id={gradientId} gradientTransform="rotate(90)">
                {gradient.map((color, index) => (
                  <stop
                    key={`${color}${index}`}
                    offset={`${index / (gradient.length - 1)}`}
                    stopColor={`${color}`}
                  />
                ))}
              </linearGradient>
            </defs>
          )}
          <g>
            <path d={`${svgPath}`} fill={color} />
          </g>
        </svg>
      </View>
    )
  },
)
