import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitFrame from './orbitFrame'
import OrbitHome from './orbitHome'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import { App, Electron } from '@mcro/all'

@UI.injectTheme
@view.attach('appStore')
@view
export default class OrbitDocked {
  render({ appStore, orbitPage, theme }) {
    const headerBg = theme.base.background
    return (
      <UI.Theme name="tan">
        <OrbitFrame
          headerBg={headerBg}
          orbitPage={orbitPage}
          shouldShow={() =>
            App.isShowingOrbit && Electron.orbitState.dockedPinned
          }
        >
          <OrbitHeader headerBg={headerBg} />
          <orbitInner>
            <OrbitHome if={!appStore.showSettings} />
            <OrbitSettings />
          </orbitInner>
        </OrbitFrame>
      </UI.Theme>
    )
  }

  static style = {
    orbitInner: {
      position: 'relative',
      flex: 1,
      zIndex: 10,
    },
  }
}
