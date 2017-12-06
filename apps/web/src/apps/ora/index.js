import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from './panes/sidebar'
import OraHeader from './oraHeader'
import OraDrawer from './oraDrawer'
import OraActionBar from './oraActionBar'
import OraBlur from './oraBlur'
import * as Constants from '~/constants'

const listProps = {
  itemProps: {
    size: 1.05,
    padding: [8, 12],
    glow: true,
    glowProps: {
      color: '#fff',
      scale: 1,
      blur: 70,
      opacity: 0.1,
      show: false,
      resist: 60,
      zIndex: 1,
    },
    secondaryProps: {
      alpha: 0.3,
    },
    highlightBackground: [0, 0, 0, 0.15],
    childrenEllipse: 2,
  },
  groupBy: 'category',
}

@view
class OraMainContent {
  render({ oraStore }) {
    return (
      <content $contentWithHeaderOpen={oraStore.ui.barFocused}>
        <Sidebar
          width={Constants.ORA_WIDTH}
          store={oraStore}
          oraStore={oraStore}
          listProps={{
            ...listProps,
            virtualized: {
              measure: oraStore.ui.height !== oraStore.ui.lastHeight,
            },
          }}
        />
      </content>
    )
  }
  static style = {
    content: {
      position: 'absolute',
      top: Constants.ORA_HEADER_HEIGHT,
      left: 0,
      right: 0,
      bottom: 0,
      transition: `transform 100ms ease-in`,
    },
    contentWithHeaderOpen: {
      transform: {
        y: Constants.ORA_HEADER_HEIGHT_FULL - Constants.ORA_HEADER_HEIGHT,
      },
    },
  }
}

export const OraContent = ({ oraStore }) => (
  <React.Fragment>
    <OraBlur if={false} oraStore={oraStore} />
    <UI.Theme name="clear-dark">
      <OraHeader oraStore={oraStore} />
    </UI.Theme>
    <OraMainContent oraStore={oraStore} />
    <OraDrawer oraStore={oraStore} />
    <OraActionBar if={false} oraStore={oraStore} />
  </React.Fragment>
)

@view.provide({
  oraStore: OraStore,
})
@view
export default class OraPage {
  render({ oraStore }) {
    return (
      <UI.Theme name="dark">
        <ora
          $visible={!oraStore.ui.state.hidden}
          ref={oraStore.ref('barRef').set}
          $$draggable
          css={{
            height: oraStore.ui.height,
          }}
        >
          <OraContent oraStore={oraStore} />
        </ora>
      </UI.Theme>
    )
  }

  static style = {
    ora: {
      pointerEvents: 'auto',
      width: Constants.ORA_WIDTH,
      // height: Constants.ORA_HEIGHT,
      background: Constants.ORA_BG,
      // border: [1, [255, 255, 255, 0.035]],
      boxShadow: [
        [0, 0, 15, [0, 0, 0, 0.5]],
        // ['inset', 0, 0, 120, [255, 255, 255, 0.053]],
      ],
      margin: 10,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'transform ease-in 100ms',
      opacity: 0,
      transform: {
        x: 8,
      },
    },
    visible: {
      opacity: 1,
      transform: {
        x: 0,
      },
    },
  }
}
