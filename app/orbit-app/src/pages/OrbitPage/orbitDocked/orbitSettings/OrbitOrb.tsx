import * as React from 'react'
import { View, color as colorize } from '@mcro/ui'

export const OrbitOrb = ({ size = 32, background, color, ...props }) => (
  <View
    background={`linear-gradient(20deg, ${colorize(background)}, ${colorize(color)})`}
    borderRadius={size}
    width={size}
    height={size}
    alignItems="center"
    justifyContent="center"
    {...props}
  >
    <View
      borderRadius={size}
      width={size}
      height={size}
      transform={{
        scale: 0.6,
      }}
      margin="auto"
    />
  </View>
)
