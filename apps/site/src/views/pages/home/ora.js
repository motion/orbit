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
    const update = lastIntersection => {
      if (this.state.lastIntersection !== lastIntersection) {
        this.setState({ lastIntersection })
      }
    }

    const { node, bounds } = this.props
    this.on(
      node,
      'scroll',
      throttle(() => {
        if (node.scrollTop < 200) {
          update(0)
        } else {
          const bottom = window.innerHeight + node.scrollTop
          for (const key of Object.keys(bounds)) {
            const bound = bounds[key]
            if (!bound) continue
            if (bound.top + window.innerHeight / 2 < bottom) {
              update(key)
              break
            }
          }
        }
      }, 100)
    )

    this.setState({ lastIntersection: 0 })
  }

  render() {
    const items = oraItems[this.state.lastIntersection]
    if (window.innerWidth < Constants.smallSize) {
      return null
    }
    return (
      <UI.Theme name="dark">
        <ora
          css={{
            position: 'fixed',
            top: 20,
            left: '50%',
            marginLeft: 305,
            transform: {
              x: '-50%',
            },
            width: Constants.ORA_WIDTH,
            height: Constants.ORA_HEIGHT,
            // borderRadius: 10,
            userSelect: 'none',
            background: [50, 50, 50, 0.7],
            borderRadius: Constants.ORA_BORDER_RADIUS,
            border: [4, '#333'],
            color: '#fff',
            zIndex: 10000,
            boxShadow: [
              '0 0 20px rgba(0,0,0,0.45)',
              'inset 0 0 180px 25px rgba(10,10,10,0.25)',
              //'inset 0 0 0 4px #444',
            ],
          }}
        >
          <header css={{ padding: 10, opacity: 0.25 }}>
            <UI.Icon name="zoom" />
          </header>
          <content css={{ padding: 0 }}>
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
}
