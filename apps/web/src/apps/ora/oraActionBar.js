import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

const stylesFirst = {}

const styles = {
  marginLeft: 10,
}

@view
export default class OraActionBar {
  render({ oraStore }) {
    const { store } = oraStore.stack.last
    const actions = store && store.actions
    return (
      <actions if={actions}>
        <actionbar>
          {actions
            .filter(Boolean)
            .map(({ flex, content, ...props }) => {
              if (flex) {
                return <div $$flex={flex} />
              }
              if (content) {
                return <span>{content}</span>
              }
              return <UI.Button glow {...props} />
            })
            .map((item, index) =>
              React.cloneElement(item, {
                key: Math.random(),
                style: {
                  ...item.props.style,
                  ...(index === 0 ? stylesFirst : styles),
                },
              })
            )}
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
      borderTop: [1, [255, 255, 255, 0.08]],
      flexFlow: 'row',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: [...Constants.ORA_BG_MAIN_OPAQUE, 0.4],
      backdropFilter: 'blur(20px)',
      height: Constants.ACTION_BAR_HEIGHT,
      zIndex: 100000,
    },
  }
}
