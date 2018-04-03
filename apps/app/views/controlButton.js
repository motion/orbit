import * as React from 'react'
import { view } from '@mcro/black'
import controlX from '~/../public/images/control-x.png'
import controlY from '~/../public/images/control-y.png'
import controlZ from '~/../public/images/control-z.png'

const icons = {
  x: controlX,
  y: controlY,
  z: controlZ,
}

@view
export default class ControlButton {
  render({ background = '#ED6A5F', icon }) {
    return (
      <controlButton css={{ background }}>
        <img src={icons[icon]} />
      </controlButton>
    )
  }

  static style = {
    controlButton: {
      width: 12,
      height: 12,
      borderRadius: 100,
      boxShadow: ['inset 0 0 0 0.5px rgba(0,0,0,0.15)'],
      alignItems: 'center',
      marginRight: 8,
      justifyContent: 'center',
      '& > img': {
        opacity: 0,
      },
      '&:hover > img': {
        opacity: 1,
      },
    },
  }
}
