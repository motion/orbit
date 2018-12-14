import * as React from 'react'
import { view } from '@mcro/black'
import { Logo } from '../views/logo'
import * as UI from '@mcro/ui'
import Router from '../router'
import * as Constants from '../constants'
import Media from 'react-media'

@view
export class BrandLogo extends React.Component<{ white?: boolean }> {
  state = { hovered: false }
  leave = () => this.setState({ hovered: false })
  hover = () => this.setState({ hovered: true })

  render() {
    const { white, ...props } = this.props
    const { hovered } = this.state
    const coloredFill = UI.color('#000') //theme.background.darken(0.5).desaturate(0.65)
    const fill = hovered ? coloredFill.alpha(0.9) : coloredFill
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <div
            {...props}
            onMouseEnter={this.hover}
            onMouseLeave={this.leave}
            style={{ cursor: 'pointer', marginLeft: isLarge ? 0 : 0 }}
            onClick={Router.link('/')}
          >
            <Logo fill={`${fill}`} size={0.19} white={white} />
          </div>
        )}
      </Media>
    )
  }
}
