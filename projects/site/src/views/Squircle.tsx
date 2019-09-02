import { View, ViewProps } from '@o/ui'
import React from 'react'

// @ts-ignore
if (CSS.paintWorklet) {
  // @ts-ignore
  CSS.paintWorklet.addModule(
    process.env.NODE_ENV === 'development' ? '/public/smooth-corners.js' : '/smooth-corners.js',
  )
}

const calc = (x, y) => [-(y - window.innerHeight / 2) / 40, (x - window.innerWidth / 2) / 40, 1.05]
const trans = (x, y, s) => `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

export const TiltSquircle = ({ style, ...rest }: ViewProps) => {
  return <Squircle whileHover={{}} {...rest} />
}

export const Squircle = ({ boxShadow, width, height, position, margin, ...props }: ViewProps) => (
  <View
    {...{
      width,
      height,
      position,
      margin,
    }}
  >
    <View
      width={width}
      height={height}
      style={{
        maskImage: 'paint(smooth-corners)',
        WebkitMaskImage: 'paint(smooth-corners)',
        borderRadius: 60,
      }}
      {...props}
    />
    {!!boxShadow && (
      <View
        position="absolute"
        zIndex={-1}
        borderRadius={+width / 3}
        transformOrigin="center center"
        transform={{
          scale: 0.98,
        }}
        {...{
          width,
          height,
          boxShadow,
        }}
      />
    )}
  </View>
)
