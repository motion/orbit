import { useAnimation } from 'framer-motion'
import { resolveThemeValues } from 'gloss'
import React from 'react'

import { Card, CardProps } from './Card'
import { View } from './View/View'

export const TiltCard = ({ style, ...rest }: CardProps) => {
  const tilt = useAnimation()
  return (
    <View
      animate={tilt}
      onMouseMove={({ clientX: x, clientY: y }) =>
        tilt.start({
          rotateY: (x - window.innerWidth / 2) / 40,
          rotateX: -(y - window.innerHeight / 2) / 40,
          scale: 1.05,
          perspective: 10000,
        })
      }
      onMouseLeave={() => tilt.start({ rotateY: 0, rotateX: 0, scale: 1 })}
      style={
        // TODO fix types
        resolveThemeValues({
          flex: rest.flex,
          height: rest.height,
          width: rest.width,
          margin: rest.margin,
          ...style,
        }) as any
      }
    >
      <Card flex={1} {...rest} />
    </View>
  )
}
