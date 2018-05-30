import * as React from 'react'
import { view } from '@mcro/black'
import Logo from '~/views/logo'
import * as UI from '@mcro/ui'

@view
export class BrandLogo extends React.Component {
  render({ white, ...props }) {
    return (
      <brandMark {...props}>
        <orbit />
        <Logo size={0.2} white={white} />
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      alignItems: 'center',
      textAlign: 'center',
      margin: [-22, -22],
      // marginLeft: -20,
    },
    orbit: {
      width: 350,
      height: 350,
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 1000,
      zIndex: -1,
      transform: {
        x: -150,
        y: -220,
      },
    },
  }

  static theme = (_, theme) => {
    return {
      orbit: {
        border: [5, theme.base.background.darken(0.1)],
      },
    }
  }
}
