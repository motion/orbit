import { View, ViewProps } from '@o/ui'
import React from 'react'
import { animated, useSpring } from 'react-spring'

// @ts-ignore
if (CSS.paintWorklet) {
  // @ts-ignore
  CSS.paintWorklet.addModule('/smooth-corners.js')
}

const calc = (x, y) => [-(y - window.innerHeight / 2) / 40, (x - window.innerWidth / 2) / 40, 1.05]
const trans = (x, y, s) => `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

export const TiltSquircle = ({ style, ...rest }: ViewProps) => {
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }))
  return (
    <Squircle
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ ...style, transform: props.xys.to(trans as any) }}
      {...rest}
    />
  )
}

export const Squircle = ({
  boxShadow,
  width,
  height,
  position,
  margin,
  style,
  ...props
}: ViewProps) => (
  <View
    {...{
      width,
      height,
      position,
      margin,
    }}
  >
    <animated.div style={{ ...style, display: 'flex', flexFlow: 'column', zIndex: 2 }}>
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
    </animated.div>
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
