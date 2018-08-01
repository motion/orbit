import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './OrbitHome'
import { OrbitSettings } from './OrbitSettings'
import { OrbitHomeHeader } from './OrbitHomeHeader'
import { OrbitHeader } from './OrbitHeader'
import { OrbitSearchResults } from './orbitSearch/OrbitSearchResults'
import { OrbitDirectory } from './OrbitDirectory'
import { App } from '@mcro/stores'
import { PaneManagerStore } from './PaneManagerStore'
import { BORDER_RADIUS, CHROME_PAD } from '../../constants'
import { SearchStore } from '../../stores/SearchStore'
import { AppStore } from '../../stores/AppStore'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitFilterBar } from './orbitHeader/OrbitFilterBar'
import { OrbitDockedChrome } from './orbitDocked/OrbitDockedChrome'

const Frame = view(UI.Col, {
  position: 'absolute',
  top: 10 + CHROME_PAD,
  right: 10 + CHROME_PAD,
  bottom: 10 + CHROME_PAD,
  width: ORBIT_WIDTH - CHROME_PAD,
  borderRadius: BORDER_RADIUS + 2,
  zIndex: 2,
  flex: 1,
  pointerEvents: 'none',
  opacity: 0,
  // transition: 'bottom ease 80ms',
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

// having this have -20 margin on sides
// means we have nice shadows on inner content
// that overlap the edge of the frame and dont cut off
// but still hide things that go below the bottom as it should
const OrbitInner = view({
  position: 'relative',
  zIndex: 4,
  // this may cause slowness in hover state css, or did for at one point
  overflow: 'hidden',
  pointerEvents: 'none',
  flex: 1,
  borderBottomRadius: BORDER_RADIUS,
  '& > *': {
    pointerEvents: 'auto',
  },
})

@view.attach('appStore', 'searchStore')
@view.provide({
  paneStore: PaneManagerStore,
})
@view
class OrbitDockedInner extends React.Component<{
  paneStore: PaneManagerStore
  searchStore: SearchStore
  appStore: AppStore
}> {
  render() {
    const { paneStore, appStore, searchStore } = this.props
    const { animationState } = paneStore
    // log('DOCKED ------------', App.orbitState.docked)
    return (
      <Frame
        visible={animationState.visible}
        willAnimate={animationState.willAnimate}
      >
        <OrbitDockedChrome appStore={appStore} />
        <UI.View borderRadius={BORDER_RADIUS} flex={1}>
          <OrbitHeader
            borderRadius={BORDER_RADIUS}
            after={
              <>
                <OrbitHomeHeader paneStore={paneStore} />
              </>
            }
          />
          <OrbitFilterBar filterStore={searchStore.searchFilterStore} />
          <OrbitInner height={window.innerHeight}>
            <div style={{ position: 'relative', flex: 1 }}>
              <OrbitHome name="home" paneStore={paneStore} />
              <OrbitDirectory name="directory" paneStore={paneStore} />
              <OrbitSearchResults name="docked-search" />
              <OrbitSettings name="settings" />
            </div>
          </OrbitInner>
        </UI.View>
      </Frame>
    )
  }
}

export const OrbitDocked = props => (
  <UI.Theme name="grey">
    <OrbitDockedInner {...props} />
  </UI.Theme>
)
