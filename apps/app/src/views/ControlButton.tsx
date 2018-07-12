import * as React from 'react'
import { view } from '@mcro/black'
import controlX from '../../public/images/control-x.png'
import controlY from '../../public/images/control-y.png'
import controlZ from '../../public/images/control-z.png'
import * as UI from '@mcro/ui'

const icons = {
  x: controlX,
  y: controlY,
  z: controlZ,
}

const ControlButtonChrome = view(UI.Col, {
  width: 12,
  height: 12,
  padding: 4,
  marginRight: 8,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  '& > img': {
    opacity: 0,
  },
  '&:hover > img': {
    opacity: 1,
  },
})

export const ControlButton = ({
  background = '#ED6A5F',
  icon,
  borderColor,
  borderWidth = 0.5,
  ...props
}) => {
  return (
    <ControlButtonChrome
      background={background}
      boxShadow={[
        [
          'inset',
          0,
          0,
          0,
          borderWidth,
          borderColor || UI.color(background).darken(0.1),
        ],
      ]}
      {...props}
    >
      <img src={icons[icon]} />
    </ControlButtonChrome>
  )
}
