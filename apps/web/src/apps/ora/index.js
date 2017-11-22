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

@view.provide({
  oraStore: OraStore,
})
@view
export default class OraPage {
  render({ oraStore }) {
    return (
      <UI.Theme name="dark">
        <ora
          $visible={!oraStore.state.hidden}
          ref={oraStore.ref('barRef').set}
          $$draggable
        >
          <OraBlur oraStore={oraStore} />
          <UI.Theme name="clear-dark">
            <OraHeader oraStore={oraStore} />
          </UI.Theme>
          <content>
            <Sidebar
              width={Constants.ORA_WIDTH}
              store={oraStore}
              oraStore={oraStore}
              itemProps={{
                size: 1.1,
                padding: [8, 12],
                glow: true,
                glowProps: {
                  color: '#fff',
                  scale: 1,
                  blur: 70,
                  opacity: 0.1,
                  show: false,
                  resist: 60,
                  zIndex: -1,
                },
                highlightBackground: [255, 255, 255, 0.048],
                childrenEllipse: 2,
              }}
            />
          </content>
          <OraDrawer oraStore={oraStore} />
          <OraActionBar oraStore={oraStore} />
          <fakeWhiteBg
            if={oraStore.showWhiteBottomBg}
            css={{
              background: '#fff',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              height: Constants.ACTION_BAR_HEIGHT,
            }}
          />
        </ora>
      </UI.Theme>
    )
  }

  static style = {
    ora: {
      width: Constants.ORA_WIDTH,
      height: Constants.ORA_HEIGHT,
      background: [25, 25, 25, 0.98],
      border: [1, [255, 255, 255, 0.025]],
      boxShadow: [
        [0, 0, 15, [0, 0, 0, 0.8]],
        // ['inset', 0, 0, 120, [255, 255, 255, 0.053]],
      ],
      margin: 10,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'all ease-in 100ms',
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
    content: {
      position: 'relative',
      flex: 1,
    },
  }
}
