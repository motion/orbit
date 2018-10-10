import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome/OrbitHome'
import { OrbitSettings } from './orbitSettings/OrbitSettings'
import { OrbitHomeHeader } from './orbitHome/OrbitHomeHeader'
import { OrbitHeader } from '../orbitHeader/OrbitHeader'
import { OrbitSearchResults } from './orbitSearch/OrbitSearchResults'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../PaneManagerStore'
import { BORDER_RADIUS } from '../../../constants'
import { SearchStore } from './SearchStore'
import { OrbitStore } from '../../OrbitStore'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitDockedChrome } from './OrbitDockedChrome'
import { OrbitOnboard } from './orbitOnboard/OrbitOnboard'
import { Logger } from '@mcro/logger'
import { OrbitNav } from './orbitHome/OrbitNav'

const log = new Logger('OrbitDocked')

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  appStore?: OrbitStore
  store?: OrbitDockedStore
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

// having this have -20 margin on sides
// means we have nice shadows on inner content
// that overlap the edge of the frame and dont cut off
// but still hide things that go below the bottom as it should
const OrbitDockedInner = view({
  position: 'relative',
  zIndex: 4,
  // this may cause slowness in hover state css, or did for at one point
  // overflow: 'hidden',
  pointerEvents: 'none',
  flex: 1,
  borderBottomRadius: BORDER_RADIUS,
  '& > *': {
    pointerEvents: 'auto',
  },
})

const Interactive = view({
  disabled: {
    opacity: 0,
    pointerEvents: 'none',
  },
})

@view.attach('paneManagerStore', 'searchStore')
class OrbitDockedContents extends React.PureComponent<Props> {
  render() {
    const { paneManagerStore } = this.props
    return (
      <>
        <OrbitHeader
          borderRadius={BORDER_RADIUS}
          after={<OrbitHomeHeader paneManagerStore={paneManagerStore} />}
        />
        <OrbitDockedInner id="above-content" style={{ height: window.innerHeight }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Interactive disabled={!/home|search/.test(paneManagerStore.activePane)}>
              <OrbitNav />
            </Interactive>

            <OrbitOnboard name="onboard" />
            <OrbitHome name="home" />
            <OrbitSearchResults name="docked-search" />
            <OrbitSettings name="settings" />
          </div>
        </OrbitDockedInner>
      </>
    )
  }
}

class OrbitDockedStore {
  shouldShowOrbitDocked = react(() => {
    // always show this when only one window
    // because we hide via electron not here
    // otherwise use the normal docked
    if (App.appsState.length === 1) {
      return true
    } else {
      return App.orbitState.docked
    }
  })
}

@view.attach('orbitStore', 'appsStore', 'selectionStore', 'queryStore', 'keyboardStore')
@view.provide({
  paneManagerStore: PaneManagerStore,
})
@view.provide({
  searchStore: SearchStore,
})
@view.attach({
  store: OrbitDockedStore,
})
@view
export class OrbitDocked extends React.Component<Props> {
  render() {
    // a note:
    // if you try and make this hide on electron hide note one thing:
    // electron stops rendering the app when its hidden
    // so if you "hide" here it will actually flicker when it shows again
    // because it hides in electron before rendering the hide here and then
    // does the hide/show after the toggle
    log.timer('orbit', '-------- DOCKED ------------')
    const theme = App.state.darkTheme ? 'dark' : 'clearLight'
    return (
      <UI.Theme name={theme}>
        <OrbitDockedFrame
          className={`theme-${theme}`}
          visible={this.props.store.shouldShowOrbitDocked}
        >
          <OrbitDockedChrome />
          <OrbitDockedContents />
        </OrbitDockedFrame>
      </UI.Theme>
    )
  }
}
