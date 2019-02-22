import { gloss, View, ViewProps } from '@mcro/gloss'
import React, { forwardRef } from 'react'

export const GradientOutlineCircle = ({ startColor = 'red', stopColor = 'blue', ...props }) => {
  return (
    <svg width="55px" height="55px" viewBox="0 0 55 55" {...props}>
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
          <stop stopColor={stopColor} stopOpacity="0.5" offset="0%" />
          <stop stopColor={startColor} stopOpacity="0.5" offset="100%" />
        </linearGradient>
      </defs>
      <g id="Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M27.4375,54.7578125 C12.4244157,54.7578125 0.25390625,42.587303 0.25390625,27.5742188 C0.25390625,12.5611345 12.4244157,0.390625 27.4375,0.390625 C42.4505843,0.390625 54.6210938,12.5611345 54.6210938,27.5742188 C54.6210938,42.587303 42.4505843,54.7578125 27.4375,54.7578125 Z M27.4375,48.065402 C38.754468,48.065402 47.9286832,38.8911867 47.9286832,27.5742188 C47.9286832,16.2572508 38.754468,7.08303553 27.4375,7.08303553 C16.120532,7.08303553 6.94631678,16.2572508 6.94631678,27.5742188 C6.94631678,38.8911867 16.120532,48.065402 27.4375,48.065402 Z"
          id="Oval-2"
          fill="url(#linearGradient-1)"
        />
      </g>
    </svg>
  )
}

export const OrbitOrb = forwardRef<any, ViewProps>(function OrbitOrb(
  { size = 32, colors = ['red', 'green'], ...props },
  ref,
) {
  // make sure its even number
  let innerSize = Math.ceil(size * 0.65)
  if (innerSize % 2 !== 0) {
    innerSize -= 1
  }
  return (
    <OrbBackground
      ref={ref}
      width={size}
      height={size}
      borderRadius={size * 2}
      {...props}
      className={`undraggable ${props.className || ''}`}
    >
      <GradientOutlineCircle
        width={innerSize}
        height={innerSize}
        startColor={colors[0]}
        stopColor={colors[1]}
      />
    </OrbBackground>
  )
})

const OrbBackground = gloss(View, {
  alignItems: 'center',
  justifyContent: 'center',
}).theme((_, theme) => ({
  background: theme.background.isDark()
    ? theme.background.darken(0.4)
    : theme.background.lighten(0.4),
}))
