import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome/OrbitHome'
import { OrbitSettings } from './orbitSettings/OrbitSettings'
import { OrbitHomeHeader } from './orbitHome/OrbitHomeHeader'
import { OrbitHeader } from '../orbitHeader/OrbitHeader'
import { OrbitSearchResults } from './orbitSearch/OrbitSearchResults'
import { OrbitDirectory } from './OrbitDirectory'
import { OrbitApps } from './orbitApps/OrbitApps'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../PaneManagerStore'
import { BORDER_RADIUS } from '../../../constants'
import { SearchStore } from './SearchStore'
import { OrbitStore } from '../../OrbitStore'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitSuggestionBar } from '../orbitHeader/OrbitSuggestionBar'
import { OrbitDockedChrome } from './OrbitDockedChrome'
import { OrbitOnboard } from './orbitOnboard/OrbitOnboard'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  appStore?: OrbitStore
  // store?: OrbitDockedStore
}

const OrbitDockedFrame = view(UI.Col, {
  position: 'absolute',
  top: 10,
  right: 10,
  bottom: 10,
  width: ORBIT_WIDTH,
  borderRadius: BORDER_RADIUS + 2,
  zIndex: 2,
  flex: 1,
  pointerEvents: 'none',
  opacity: 0,
  visible: {
    pointerEvents: 'auto',
    opacity: 1,
  },
})

const OrbitDockedInnerFrame = view(UI.Col, {
  opacity: 0,
  // transform: {
  //   x: 12,
  // },
  // transition: `
  //   transform ease 80ms,
  //   opacity ease 80ms
  // `,
  visible: {
    opacity: 1,
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

@view.attach('orbitStore', 'appsStore', 'selectionStore', 'queryStore', 'keyboardStore')
@view.provide({
  paneManagerStore: PaneManagerStore,
})
@view.provide({
  searchStore: SearchStore,
})
@view
export class OrbitDocked extends React.Component<Props> {
  render() {
    const { searchStore, paneManagerStore } = this.props
    // log.info('DOCKED ------------', store.animationState)
    const theme = App.state.darkTheme ? 'dark' : 'light'
    return (
      <UI.Theme name={theme}>
        <OrbitDockedFrame className={`theme-${theme}`} visible={App.orbitState.docked}>
          <OrbitDockedChrome />
          <OrbitDockedInnerFrame
            borderBottomRadius={BORDER_RADIUS}
            flex={1}
            visible={App.orbitState.docked}
          >
            <OrbitHeader
              borderRadius={BORDER_RADIUS}
              after={<OrbitHomeHeader paneManagerStore={paneManagerStore} />}
            />
            <OrbitSuggestionBar
              paneManagerStore={paneManagerStore}
              filterStore={searchStore.searchFilterStore}
            />
            <OrbitDockedInner id="above-content" style={{ height: window.innerHeight }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <OrbitOnboard name="onboard" />
                <OrbitHome name="home" />
                <OrbitDirectory name="directory" />
                <OrbitApps name="apps" />
                <OrbitSearchResults name="docked-search" />
                <OrbitSettings name="settings" />
              </div>
            </OrbitDockedInner>
          </OrbitDockedInnerFrame>
        </OrbitDockedFrame>
      </UI.Theme>
    )
  }
}
