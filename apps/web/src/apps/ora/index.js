import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from '../home/sidebar'
import OraMain from './oraMain'
import OraHeader from './oraHeader'

const sidebars = {
  oramain: OraMain,
}

@view.provide({
  homeStore: OraStore,
})
@view
export default class OraPage {
  render({ homeStore }) {
    return (
      <UI.Theme name="clear-dark">
        <home
          $visible={!homeStore.hidden}
          ref={homeStore.ref('barRef').set}
          $$fullscreen
          $$draggable
        >
          <OraHeader homeStore={homeStore} />
          <content>
            <Sidebar
              sidebars={sidebars}
              homeStore={homeStore}
              itemProps={{
                size: 1,
                padding: [6, 10],
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
      flex: 1,
      position: 'relative',
    },
  }
}
