import React from 'react'
import { animated, useSpring } from 'react-spring'

import { Card, CardProps } from './Card'

const calc = (x, y) => [-(y - window.innerHeight / 2) / 40, (x - window.innerWidth / 2) / 40, 1.05]
const trans = (x, y, s) => `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

export const TiltCard = ({ style, ...rest }: CardProps) => {
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }))

  return (
    <animated.div
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{
        flex: rest.flex,
        height: rest.height,
        width: rest.width,
        margin: rest.margin,
        ...style,
        transform: props.xys['to'](trans as any),
      }}
    >
      <Card flex={1} {...rest} />
    </animated.div>
  )
}
