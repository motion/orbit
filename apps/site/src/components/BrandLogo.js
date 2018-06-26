import * as React from 'react'
import { view } from '@mcro/black'
import { Logo } from '~/views/logo'
import * as UI from '@mcro/ui'
import Router from '~/router'
import * as Constants from '~/constants'
import Media from 'react-media'

@UI.injectTheme
@view
export class BrandLogo extends React.Component {
  state = { hovered: false }
  leave = () => this.setState({ hovered: false })
  hover = () => this.setState({ hovered: true })

  render({ theme, white, ...props }, { hovered }) {
    const coloredFill = UI.color('#000') //theme.base.background.darken(0.5).desaturate(0.65)
    const fill = hovered ? coloredFill.alpha(0.9) : coloredFill
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <brandMark
            {...props}
            onMouseEnter={this.hover}
            onMouseLeave={this.leave}
            css={{ cursor: 'pointer', marginLeft: isLarge ? -12 : 0 }}
            onClick={Router.link('/')}
          >
            <orbit />
            <Logo fill={`${fill}`} size={0.175} white={white} />
          </brandMark>
        )}
      </Media>
    )
  }

  static style = {
    brandMark: {
      opacity: 0.8,
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
