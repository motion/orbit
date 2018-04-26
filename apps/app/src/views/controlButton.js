import * as React from 'react'
import { view } from '@mcro/black'
import controlX from '~/../public/images/control-x.png'
import controlY from '~/../public/images/control-y.png'
import controlZ from '~/../public/images/control-z.png'
import * as UI from '@mcro/ui'

const icons = {
  x: controlX,
  y: controlY,
  z: controlZ,
}

@view
export default class ControlButton {
  static defaultProps = {
    background: '#ED6A5F',
    borderWidth: 0.5,
  }

  render({ background, icon, borderColor, borderWidth, ...props }) {
    return (
      <controlButton
        css={{
          background,
          boxShadow: [
            [
              'inset',
              0,
              0,
              0,
              borderWidth,
              borderColor || UI.color(background).darken(0.1),
            ],
          ],
        }}
        {...props}
      >
        <img src={icons[icon]} />
      </controlButton>
    )
  }

  static style = {
    controlButton: {
      width: 12,
      height: 12,
      padding: 4,
      margin: -4,
      marginRight: 8,
      borderRadius: 100,
      // border: [2, '#fff'],
      alignItems: 'center',
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
