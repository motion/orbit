import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitHome from './orbitHome'
import OrbitSettings from './orbitSettings'
import OrbitHeader from './orbitHeader'
import OrbitSearchResults from './orbitSearchResults'
import { App } from '@mcro/all'

const SHADOW_PAD = 85
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.2]]

@UI.injectTheme
@view.attach('appStore')
@view
class OrbitDocked {
  render({ appStore, theme }) {
    const background = theme.base.background
    const borderColor = theme.base.background.darken(0.25).desaturate(0.6)
    const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
    return (
      <frame
        $visible={App.orbitState.docked}
        css={{ background, boxShadow: [borderShadow, DOCKED_SHADOW] }}
      >
        <OrbitHeader headerBg={background} />
        <orbitInner>
          <OrbitHome if={!appStore.showSettings} appStore={appStore} />
          <OrbitSearchResults />
          <OrbitSettings />
        </orbitInner>
      </frame>
    )
  }

  static style = {
    frame: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 2,
      flex: 1,
      pointerEvents: 'none',
      width: App.dockedWidth,
      height: '100%',
      transition: 'all ease-in 100ms',
      opacity: 0,
      transform: {
        x: 10,
      },
    },
    visible: {
      pointerEvents: 'auto',
      opacity: 1,
      transform: {
        x: 0,
      },
    },
    orbitInner: {
      position: 'relative',
      flex: 1,
    },
  }
}

export default props => (
  <UI.Theme name="tan">
    <OrbitDocked {...props} />
  </UI.Theme>
)
