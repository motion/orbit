import * as React from 'react'
import { view } from '@mcro/black'
import { Logo } from '~/views/logo'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view
export class BrandLogo extends React.Component {
  render({ theme, white, ...props }) {
    const fill = theme.base.background
      .darken(0.35)
      .desaturate(0.7)
      .toString()
    return (
      <brandMark {...props}>
        <orbit />
        <Logo iconFill={fill} fill={fill} size={0.2} white={white} />
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      alignItems: 'center',
      textAlign: 'center',
      margin: [-12, 0],
    },
    orbit: {
      width: 250,
      height: 250,
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 1000,
      zIndex: -1,
      transform: {
        x: -90,
        y: -120,
      },
    },
  }

  static theme = (_, theme) => {
    return {
      orbit: {
        // border: [1, theme.base.background.darken(0.1)],
        // background: theme.base.background.darken(0.05).alpha(0.5),
      },
    }
  }
}
