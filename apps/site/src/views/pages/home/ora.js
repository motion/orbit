import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { throttle } from 'lodash'
import * as Constants from '~/constants'
import oraItems from './oraItems'

@view
export default class Ora extends React.Component {
  state = {
    lastIntersection: -1,
  }

  componentDidMount() {
    this.watch(() => {
      this.setState({ lastIntersection: this.props.homeStore.activeKey })
    })

    this.setState({ lastIntersection: 0 })
  }

  render() {
    const items = oraItems[this.state.lastIntersection]
    if (window.innerWidth < Constants.smallSize) {
      return null
    }
    return (
      <UI.Theme name="dark">
        <ora>
          <header>
            <UI.Icon name="zoom" />
          </header>
          <content>
            <UI.List
              itemProps={{ padding: [10, 15], glow: true, size: 1.15 }}
              key={this.state.lastIntersection}
              groupBy="category"
              items={items}
            />
          </content>
        </ora>
      </UI.Theme>
    )
  }
  static style = {
    ora: {
      position: 'fixed',
      top: 40,
      left: '50%',
      marginLeft: 305,
      transform: {
        x: '-50%',
      },
      width: Constants.ORA_WIDTH,
      height: Constants.ORA_HEIGHT,
      borderRadius: Constants.ORA_BORDER_RADIUS,
      userSelect: 'none',
      background: [40, 40, 40, 0.6],
      border: [4, 'transparent'],
      color: '#fff',
      zIndex: 10000,
      boxShadow: ['0 0 20px rgba(0,0,0,0.45)'],
    },
    header: { padding: 10, opacity: 0.25 },
    content: { padding: 0 },
  }
}
