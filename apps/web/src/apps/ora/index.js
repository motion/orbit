import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from '../panes/sidebar'
import * as Sidebars from '../panes/sidebars'
import OraHeader from './oraHeader'
import * as Constants from '~/constants'

const prevent = e => {
  console.log('preventing')
  e.preventDefault()
  e.stopPropagation()
}

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
          <overlay
            if={oraStore.wasBlurred}
            $$fullscreen
            css={{
              zIndex: 100000000000,
            }}
            onMouseDown={prevent}
            onClick={prevent}
          />
          <UI.Theme name="clear-dark">
            <OraHeader oraStore={oraStore} />
          </UI.Theme>
          <content>
            <Sidebar
              width={Constants.ORA_WIDTH}
              store={oraStore}
              oraStore={oraStore}
              sidebars={Sidebars}
              itemProps={{
                size: 1.1,
                padding: [6, 12],
                glow: true,
                highlightBackground: [255, 255, 255, 0.08],
                childrenEllipse: 2,
              }}
            />
          </content>
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
      border: [1, [255, 255, 255, 0.1]],
      boxShadow: [
        [0, 0, 15, [0, 0, 0, 0.9]],
        ['inset', 0, 0, 120, [255, 255, 255, 0.053]],
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
