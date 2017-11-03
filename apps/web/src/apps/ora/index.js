import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from '../panes/sidebar'
import * as Sidebars from '../panes/sidebars'
import OraHeader from './oraHeader'

const width = 280

@view.provide({
  oraStore: OraStore,
})
@view
export default class OraPage {
  render({ oraStore }) {
    return (
      <UI.Theme name="dark">
        <ora
          $visible={!oraStore.hidden}
          ref={oraStore.ref('barRef').set}
          $$draggable
        >
          <UI.Theme name="clear-dark">
            <OraHeader oraStore={oraStore} />
          </UI.Theme>
          <content>
            <Sidebar
              width={width}
              store={oraStore}
              oraStore={oraStore}
              sidebars={Sidebars}
              itemProps={{
                size: 1,
                padding: [6, 12],
                glow: true,
                highlightBackground: [255, 255, 255, 0.08],
                childrenEllipse: 3,
              }}
            />
          </content>
        </ora>
      </UI.Theme>
    )
  }

  static style = {
    ora: {
      width,
      background: [20, 20, 20, 0.98],
      boxShadow: [[0, 0, 10, [0, 0, 0, 0.4]]],
      margin: 10,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'all ease-in 100ms',
      opacity: 0,
      height: 600,
      transform: {
        x: 20,
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
