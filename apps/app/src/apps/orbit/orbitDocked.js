import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome'
import { OrbitSettings } from './OrbitSettings'
import { OrbitHomeHeader } from './orbitHomeHeader'
import { OrbitHeader } from './orbitHeader'
import { OrbitSearchResults } from './orbitSearchResults'
import { OrbitDirectory } from './OrbitDirectory'
import { App } from '@mcro/stores'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'
import { BORDER_RADIUS } from '../../constants'

const SHADOW_PAD = 120
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.55]]

const Frame = view(UI.Col, {
  position: 'absolute',
  top: 10,
  right: 10,
  bottom: 100,
  borderRadius: BORDER_RADIUS,
  zIndex: 2,
  flex: 1,
  pointerEvents: 'none',
  width: App.dockedWidth,
  opacity: 0,
  transform: {
    x: 6,
  },
})

Frame.theme = ({ theme, visible, willAnimate }) => ({
  background: theme.base.background,
  ...(visible && {
    pointerEvents: 'auto',
    opacity: 1,
    transform: {
      x: 0,
    },
  }),
  ...(willAnimate && {
    willChange: 'transform, opacity',
    transition: `
      transform ease-in ${App.animationDuration}ms,
      opacity ease-in ${App.animationDuration}ms
    `,
  }),
})

const Border = view(UI.FullScreen, {
  zIndex: Number.MAX_SAFE_INTEGER,
  pointerEvents: 'none',
})

Border.theme = ({ theme }) => {
  const borderColor = theme.base.background.darken(0.25).desaturate(0.6)
  const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
  const borderGlow = ['inset', 0, 0, 0, 1, [255, 255, 255, 0.5]]
  return {
    borderRadius: BORDER_RADIUS,
    boxShadow: [borderShadow, borderGlow, DOCKED_SHADOW],
  }
}

// having this have -20 margin on sides
// means we have nice shadows on inner content
// that overlap the edge of the frame and dont cut off
// but still hide things that go below the bottom as it should
const OrbitInner = view({
  position: 'relative',
  zIndex: 3,
  overflow: 'hidden',
  margin: [-20, -20, 0, -20],
  padding: [20, 20, 0, 20],
  flex: 1,
})

@attachTheme
@view.attach('appStore', 'orbitStore')
@view.provide({
  paneStore: OrbitDockedPaneStore,
})
@view
class OrbitDockedInner extends React.Component {
  render({ paneStore, appStore, theme }) {
    const { animationState } = paneStore
    log('DOCKED ------------', App.orbitState.docked)
    return (
      <>
        <Frame
          visible={animationState.visible}
          willAnimate={animationState.willAnimate}
        >
          <Border />
          <div $container>
            <OrbitHeader
              borderRadius={BORDER_RADIUS}
              after={<OrbitHomeHeader paneStore={paneStore} theme={theme} />}
            />
            <OrbitInner>
              <div $orbitRelativeInner>
                <OrbitHome
                  name="home"
                  appStore={appStore}
                  paneStore={paneStore}
                />
                <OrbitDirectory
                  name="directory"
                  appStore={appStore}
                  paneStore={paneStore}
                />
                <OrbitSearchResults
                  name="summary-search"
                  parentPane="summary"
                />
                <OrbitSettings name="settings" />
              </div>
            </OrbitInner>
          </div>
        </Frame>
      </>
    )
  }

  static style = {
    container: {
      borderRadius: BORDER_RADIUS + 1,
      // overflow: 'hidden',
      flex: 1,
    },
    orbitRelativeInner: {
      position: 'relative',
      flex: 1,
    },
  }
}

export const OrbitDocked = props => (
  <UI.Theme name="grey">
    <OrbitDockedInner {...props} />
  </UI.Theme>
)
