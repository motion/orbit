import * as React from 'react'
import { view } from '@mcro/black'
import { Logo } from '~/views/logo'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view
export class BrandLogo extends React.Component {
  state = { hovered: false }
  leave = () => this.setState({ hovered: false })
  hover = () => this.setState({ hovered: true })

  render({ theme, white, ...props }, { hovered }) {
    const fill = theme.base.background
      .darken(0.5)
      .desaturate(0.65)
      .alpha(hovered ? 0.9 : 1)
      .toString()
    return (
      <brandMark {...props} onMouseEnter={this.hover} onMouseLeave={this.leave}>
        <orbit />
        <Logo fill={fill} size={0.2} white={white} />
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
