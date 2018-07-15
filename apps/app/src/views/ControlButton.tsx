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

export const ControlButtonChrome = view(UI.Col, {
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

ControlButtonChrome.theme = ({ theme, borderWidth, ...props }) => {
  const background =
    props.backgroud || theme.base.background.darken(0.02).desaturate(0.02)
  const borderColor = props.borderColor || UI.color(background).darken(0.1)
  return {
    background,
    boxShadow: [['inset', 0, 0, 0, borderWidth, borderColor]],
  }
}

export const ControlButton = ({ icon, ...props }) => {
  return (
    <ControlButtonChrome {...props}>
      <img src={icons[icon]} />
    </ControlButtonChrome>
  )
}
