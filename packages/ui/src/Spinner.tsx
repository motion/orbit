import { useTheme } from 'gloss'
import React, { HTMLAttributes, memo } from 'react'

import { useDefaultProps } from './hooks/useDefaultProps'

// https://github.com/chantastic/react-svg-spinner

export type SpinnerProps = HTMLAttributes<SVGElement> & {
  color?: any
  thickness?: number
  gap?: number
  speed?: 'fast' | 'slow'
  size?: string
}

export const Spinner = memo((directProps: SpinnerProps) => {
  const theme = useTheme()
  const { color, gap, thickness, size, speed, ...rest } = useDefaultProps(
    {
      color: theme.color,
      gap: 4,
      thickness: 4,
      size: '1em',
      speed: 'slow',
    },
    directProps,
  )
  return (
    <svg
      height={size}
      width={size}
      {...rest}
      style={{ animationDuration: `${speedSwitch(speed)}ms` }}
      className="__react-svg-spinner_circle"
      role="img"
      aria-labelledby="title desc"
      viewBox="0 0 32 32"
    >
      <title id="title">Circle loading spinner</title>
      <desc id="desc">Image of a partial circle indicating "loading."</desc>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .__react-svg-spinner_circle{
            transition-property: transform;
            animation-name: __react-svg-spinner_infinite-spin;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
        @keyframes __react-svg-spinner_infinite-spin {
            from {transform: rotate(0deg)}
            to {transform: rotate(360deg)}
        }
      `,
        }}
      />
      <circle
        role="presentation"
        cx={16}
        cy={16}
        r={14 - thickness / 2}
        stroke={`${color}`}
        fill="none"
        strokeWidth={thickness}
        strokeDasharray={Math.PI * 2 * (11 - gap)}
        strokeLinecap="round"
      />
    </svg>
  )
})

function speedSwitch(speed) {
  if (speed === 'fast') return 600
  if (speed === 'slow') return 900
  return 750
}
