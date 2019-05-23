import { Space } from '@o/models'
import { IconProps } from '@o/ui'
import React from 'react'

import { OrbitOrb } from './OrbitOrb'

export const SpaceIcon = ({
  space,
  size = 32,
  ...props
}: { space: Space } & Partial<IconProps>) => {
  return <OrbitOrb size={size} colors={space.colors} {...props} />
}

SpaceIcon.acceptsProps = {
  icon: true,
  hover: true,
}
