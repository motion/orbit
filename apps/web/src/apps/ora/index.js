import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from '../home/sidebar'
import OraMain from './oraMain'
import OraHeader from './oraHeader'
import * as Sidebars from '../panes/sidebars'

const sidebars = {
  oramain: OraMain,
  ...Sidebars,
}

@view.provide({
  homeStore: OraStore,
})
@view
export default class OraPage {
  render({ homeStore }) {
    return (
      <UI.Theme name="dark">
        <home
          $visible={!homeStore.hidden}
          ref={homeStore.ref('barRef').set}
          $$draggable
        >
          <UI.Theme name="clear-dark">
            <OraHeader homeStore={homeStore} />
          </UI.Theme>
          <content>
            <Sidebar
              sidebars={sidebars}
              homeStore={homeStore}
              itemProps={{
                size: 1,
                padding: [6, 12],
                glow: true,
                highlightBackground: [255, 255, 255, 0.08],
              }}
            />
          </content>
        </home>
      </UI.Theme>
    )
  }

  static style = {
    home: {
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
