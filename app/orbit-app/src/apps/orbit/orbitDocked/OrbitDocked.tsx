import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome/OrbitHome'
import { OrbitSettings } from './orbitSettings/OrbitSettings'
import { OrbitHomeHeader } from './orbitHome/OrbitHomeHeader'
import { OrbitHeader } from '../orbitHeader/OrbitHeader'
import { OrbitSearchResults } from './orbitSearch/OrbitSearchResults'
import { OrbitDirectory } from './OrbitDirectory'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../PaneManagerStore'
import { BORDER_RADIUS, CHROME_PAD } from '../../../constants'
import { SearchStore } from '../../../stores/SearchStore'
import { AppStore } from '../../../stores/AppStore'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitFilterBar } from '../orbitHeader/OrbitFilterBar'
import { OrbitDockedChrome } from './OrbitDockedChrome'
import { OrbitOnboard } from './orbitOnboard/OrbitOnboard'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  appStore?: AppStore
}

const OrbitDockedFrame = view(UI.Col, {
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
const OrbitDockedInner = view({
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
  paneManagerStore: PaneManagerStore,
})
@view
export class OrbitDocked extends React.Component<Props> {
  render() {
    const { paneManagerStore, appStore, searchStore } = this.props
    const { animationState } = paneManagerStore
    // log('DOCKED ------------', App.orbitState.docked)
    return (
      <UI.Theme name="grey">
        <OrbitDockedFrame
          visible={animationState.visible}
          willAnimate={animationState.willAnimate}
        >
          <OrbitDockedChrome appStore={appStore} />
          <UI.View borderBottomRadius={BORDER_RADIUS} flex={1}>
            <OrbitHeader
              borderRadius={BORDER_RADIUS}
              after={<OrbitHomeHeader paneManagerStore={paneManagerStore} />}
            />
            <OrbitFilterBar
              filterStore={searchStore.searchFilterStore}
              paneManagerStore={paneManagerStore}
            />
            <OrbitDockedInner style={{ height: window.innerHeight }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <OrbitOnboard name="onboard" />
                <OrbitHome name="home" paneManagerStore={paneManagerStore} />
                <OrbitDirectory
                  name="directory"
                  paneManagerStore={paneManagerStore}
                />
                <OrbitSearchResults name="docked-search" />
                <OrbitSettings name="settings" />
              </div>
            </OrbitDockedInner>
          </UI.View>
        </OrbitDockedFrame>
      </UI.Theme>
    )
  }
}
