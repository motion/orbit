import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from './panes/sidebar'
import OraHeader from './oraHeader'
import OraDrawer from './oraDrawer'
import OraActionBar from './oraActionBar'
import * as Constants from '~/constants'
import Screen from '@mcro/screen'

const listProps = {
  virtualized: false,
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
      alpha: 0.4,
    },
    highlightBackground: [255, 255, 255, 0.075],
    childrenEllipse: 2,
  },
  groupBy: 'category',
  onScroll: () => {
    // TODO clear all popovers
    console.log('test: should clear peek')
    Screen.setState({ hoveredWord: null })
  },
}

@view.attach('oraStore')
@view
class OraMainContent {
  shouldMeasure = () => {
    const { oraStore } = this.props
    return oraStore.ui.height !== oraStore.ui.lastHeight
  }

  render({ oraStore }) {
    return (
      <content $contentWithHeaderOpen={oraStore.ui.barFocused}>
        <Sidebar
          width={Constants.ORA_WIDTH}
          store={oraStore}
          oraStore={oraStore}
          shouldMeasure={this.shouldMeasure}
          listProps={listProps}
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
        y: 0, //Constants.ORA_HEADER_HEIGHT_FULL - Constants.ORA_HEADER_HEIGHT,
      },
    },
  }
}

const OraContent = () => (
  <React.Fragment>
    <OraHeader />
    <OraMainContent />
    <OraDrawer />
    <OraActionBar />
  </React.Fragment>
)

@view.provide({
  oraStore: OraStore,
})
@view
export default class Ora {
  render({ oraStore }) {
    const { showOra } = oraStore.ui
    return (
      <oraContainer>
        <UI.Theme name="dark">
          <ora
            $visible={showOra}
            $oraFocused={oraStore.ui.barFocused}
            ref={oraStore.ref('barRef').set}
            $$draggable
            css={{
              height: oraStore.ui.height,
              boxShadow:
                oraStore.ui.height !== 40
                  ? [
                      [0, 0, 10, 0, [0, 0, 0, 0.15]],
                      ['inset', 0, 0, 0, 0.5, [255, 255, 255, 0.4]],
                    ]
                  : [['inset', 0, 0, 0, 0.5, [255, 255, 255, 0.4]]],
            }}
          >
            <OraContent />
          </ora>
        </UI.Theme>
      </oraContainer>
    )
  }

  static style = {
    oraContainer: {
      width: Constants.ORA_WIDTH + Constants.ORA_PAD,
      position: 'relative',
      overflow: 'hidden',
    },
    ora: {
      pointerEvents: 'none !important',
      background: Constants.ORA_BG,
      // border: [1, [255, 255, 255, 0.035]],
      margin: 10,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'all ease-in 120ms',
      opacity: 0,
      transform: {
        x: Constants.ORA_WIDTH + Constants.ORA_PAD,
      },
    },
    oraFocused: {
      background: Constants.ORA_BG_FOCUSED,
    },
    visible: {
      pointerEvents: 'auto !important',
      opacity: 1,
      transform: {
        x: 0,
      },
    },
    icon: {
      position: 'absolute',
      opacity: 0,
    },
    show: {
      opacity: 0.8,
    },
  }
}
