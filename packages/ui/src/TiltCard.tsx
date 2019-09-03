import { useAnimation } from 'framer-motion'
import React from 'react'

import { Card, CardProps } from './Card'

export const TiltCard = ({ style, ...rest }: CardProps) => {
  const tilt = useAnimation()
  return (
    <View
      onMouseMove={({ clientX: x, clientY: y }) =>
        tilt.start({
          rotateY: (x - window.innerWidth / 2) / 40,
          rotateX: -(y - window.innerHeight / 2) / 40,
          scale: 1.1,
        })
      }
      onMouseLeave={() => tilt.start({ rotateY: 0, rotateX: 0, scale: 1 })}
      style={{
        flex: rest.flex,
        height: rest.height,
        width: rest.width,
        margin: rest.margin,
        ...style,
      }}
    >
      <Card flex={1} {...rest} />
    </View>
  )
}
