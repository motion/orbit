import { Space } from '@mcro/models'
import React from 'react'
import { OrbitIconProps } from './Icon'
import { OrbitOrb } from './OrbitOrb'

export function SpaceIcon({
  space,
  size = 32,
  ...props
}: { space: Space } & Partial<OrbitIconProps>) {
  return <OrbitOrb size={size} colors={space.colors} {...props} />
}

SpaceIcon['acceptsIconProps'] = true
