import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import oraItems from './oraItems'

@view
export default class Ora extends React.Component {
  render({ style, homeStore }) {
    const { show, activeKey } = homeStore

    const items = oraItems[activeKey]
    if (window.innerWidth < Constants.smallSize) {
      return null
    }
    const positionStyle = !show
      ? {
          position: 'absolute',
          top: Constants.ORA_TOP,
        }
      : {
          position: 'fixed',
          top: Constants.ORA_TOP_PAD,
        }
    return (
      <UI.Theme name="dark">
        <ora
          style={{
            ...positionStyle,
            ...style,
          }}
        >
          <header>
            <UI.Icon name="zoom" />
          </header>
          <content>
            <UI.List
              itemProps={{ padding: [10, 15], glow: true, size: 1.15 }}
              key={activeKey}
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
      left: '50%',
      marginLeft: Constants.ORA_LEFT_PAD,
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
      boxShadow: ['0 10px 80px rgba(0,0,0,0.4)'],
    },
    header: { padding: 10, opacity: 0.25 },
    content: { padding: 0 },
  }
}
