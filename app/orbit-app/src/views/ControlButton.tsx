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
  padding: 2,
  marginRight: 8,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
  '& > img': {
    opacity: 0,
  },
  '&:hover > img': {
    opacity: 0.5,
  },
})

ControlButtonChrome.theme = ({ theme, borderWidth, ...props }) => {
  console.log('cntrol button theme', theme)
  const background =
    props.background || theme.background.darken(0.2).desaturate(0.2)
  const borderColor = props.borderColor || UI.color(background).darken(0.1)
  return {
    background,
    boxShadow: [['inset', 0, 0, 0, borderWidth, borderColor]],
  }
}

const Img = view('img', {
  margin: 'auto',
  width: '100%',
  height: '100%',
  cursor: 'default',
})

export const ControlButton = ({ icon, ...props }) => {
  return (
    <ControlButtonChrome {...props}>
      <Img src={icons[icon]} />
    </ControlButtonChrome>
  )
}
