import { Button } from '@mcro/ui'
import * as React from 'react'

export const NavButton = props => (
  <Button
    acceptsHovered
    background="transparent"
    borderColor="transparent"
    glint={false}
    sizeRadius={3}
    sizeIcon={1.3}
    {...props}
  />
)
