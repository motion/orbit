import * as React from 'react'
import { Button } from '@mcro/ui'

export const NavButton = props => (
  <Button
    acceptsHovered
    background="transparent"
    borderColor="transparent"
    glint={false}
    sizeRadius={3}
    sizeIcon={1.25}
    sizeHeight={0.9}
    {...props}
  />
)
