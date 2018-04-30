import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitFrame from './orbitFrame'
import OrbitSearchResults from './orbitSearchResults'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitHomeContext from './orbitHomeContext'
import { App } from '@mcro/all'

@UI.injectTheme
@view.attach('appStore')
@view
export default class Orbit {
  render({ appStore, orbitPage, theme }) {
    const headerBg = theme.base.background
    return (
      <UI.Theme name="tan">
        <OrbitFrame
          headerBg={headerBg}
          orbitPage={orbitPage}
          shouldShow={() => !App.orbitState.hidden && !App.orbitState.docked}
        >
          <OrbitHeader headerBg={headerBg} />
          <orbitInner>
            <OrbitHomeContext if={!appStore.showSettings} appStore={appStore} />
            <OrbitSettings />
            <OrbitSearchResults />
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
