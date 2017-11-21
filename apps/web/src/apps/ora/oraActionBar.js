import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

@view
export default class OraActionBar {
  render({ oraStore }) {
    const { store } = oraStore.stack.last
    const actions = store && store.actions
    return (
      <actions if={actions}>
        <actionbar>
          <UI.Row spaced flex itemProps={{ glow: true }}>
            {actions
              .filter(Boolean)
              .map(({ flex, content, ...props }, index) => {
                if (flex) {
                  return <div key={index} $$flex={flex} />
                }
                if (content) {
                  return <span key={index}>{content}</span>
                }
                return <UI.Button key={index} {...props} />
              })}
          </UI.Row>
        </actionbar>
      </actions>
    )
  }

  static style = {
    // pads height of actionbar
    actionBarPad: {
      paddingBottom: 50,
    },
    actionbar: {
      padding: 10,
      borderTop: [1, [255, 255, 255, 0.15]],
      flexFlow: 'row',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: [0, 0, 0, 0.14],
      backdropFilter: 'blur(15px)',
      height: Constants.ACTION_BAR_HEIGHT,
      zIndex: 100000,
    },
  }
}
