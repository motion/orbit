import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './OrbitHome'
import { OrbitSettings } from './OrbitSettings'
import { OrbitHomeHeader } from './OrbitHomeHeader'
import { OrbitHeader } from './OrbitHeader'
import { OrbitSearchResults } from './OrbitSearchResults'
import { OrbitDirectory } from './OrbitDirectory'
import { App } from '@mcro/stores'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'
import { BORDER_RADIUS } from '../../constants'
import { AppStore } from '../../stores/AppStore'
import { OrbitSearchStore } from './OrbitSearchStore'

const SHADOW_PAD = 200
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.45]]

const Frame = view(UI.Col, {
  position: 'absolute',
  top: 10,
  right: 10,
  borderRadius: BORDER_RADIUS,
  zIndex: 2,
  flex: 1,
  pointerEvents: 'none',
  width: App.dockedWidth,
  opacity: 0,
  transform: {
    x: 6,
  },
  visible: {
    pointerEvents: 'auto',
    opacity: 1,
    transform: {
      x: 0,
    },
  },
  willAnimate: {
    willChange: 'transform, opacity',
    transition: `
      transform ease ${App.animationDuration}ms,
      opacity ease ${App.animationDuration}ms
    `,
  },
})

Frame.theme = ({ theme }) => ({
  background: theme.base.background,
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
  // this can be a lot more because theres padding left and right
  // and so this lets us have the top/side overflow but still cut off bottom
  borderBottomLeftRadius: 60,
  borderBottomRightRadius: 60,
})

@view.attach('appStore', 'orbitStore', 'integrationSettingsStore')
@view.provide({
  paneStore: OrbitDockedPaneStore,
  searchStore: OrbitSearchStore,
})
@view
class OrbitDockedInner extends React.Component<{
  paneStore: OrbitDockedPaneStore
  appStore: AppStore
}> {
  render() {
    const { paneStore, appStore } = this.props
    const { animationState } = paneStore
    log('DOCKED ------------', App.orbitState.docked)
    return (
      <>
        <Frame
          visible={animationState.visible}
          willAnimate={animationState.willAnimate}
          bottom={appStore.searchState.query ? 10 : 100}
        >
          <Border />
          <UI.View borderRadius={BORDER_RADIUS + 1} flex={1}>
            <OrbitHeader
              borderRadius={BORDER_RADIUS}
              after={
                <>
                  <OrbitHomeHeader paneStore={paneStore} />
                </>
              }
            />
            <OrbitInner height={window.innerHeight}>
              <UI.View position="relative" flex={1}>
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
              </UI.View>
            </OrbitInner>
          </UI.View>
        </Frame>
      </>
    )
  }
}

export const OrbitDocked = props => (
  <UI.Theme name="grey">
    <OrbitDockedInner {...props} />
  </UI.Theme>
)
