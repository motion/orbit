import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

const stylesFirst = {}

const styles = {
  marginLeft: 6,
}

@view.attach('oraStore')
@view
export default class OraActionBar {
  render({ oraStore }) {
    const { store } = oraStore.stack.last
    const actions = store && store.actions

    return (
      <UI.Theme name="clear-dark">
        <actions>
          <collapseBar onClick={oraStore.ui.toggleCollapsed}>
            <UI.Arrow />
            <UI.Icon name="menu" size={10} />
          </collapseBar>

          <actionbar if={actions && !oraStore.ui.collapsed}>
            {actions
              .filter(Boolean)
              .map(({ flex, content, ...props }) => {
                if (flex) {
                  return <flexer $$flex={flex} />
                }
                if (content) {
                  return <span>{content}</span>
                }
                return (
                  <UI.Button
                    glow
                    sizeHeight={0.9}
                    glowProps={{
                      color: [255, 255, 255],
                      opacity: 0.2,
                    }}
                    glint={false}
                    background={[255, 255, 255, 0.1]}
                    borderWidth={0}
                    {...props}
                  />
                )
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
      </UI.Theme>
    )
  }

  static style = {
    actions: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: Constants.ACTION_BAR_HEIGHT,
      justifyContent: 'center',
      pointerEvents: 'none',
    },
    actionbar: {
      padding: [0, 7],
      // background: Constants.ORA_BG_MAIN_OPAQUE,
      position: 'relative',
      zIndex: 10001,
      flexFlow: 'row',
      // so we have no pointer events on this directly
      // to let them go down to the collapse
      '& > *': {
        pointerEvents: 'auto',
      },
    },
    collapseBar: {
      height: 12,
      width: 20,
      zIndex: 1000,
      position: 'absolute',
      bottom: 0,
      left: 0,
      flexFlow: 'row',
      justifyContent: 'center',
      pointerEvents: 'auto',
      '&:hover': {
        background: [255, 255, 255, 0.025],
      },
    },
    flexer: {
      pointerEvents: 'none',
    },
  }
}
