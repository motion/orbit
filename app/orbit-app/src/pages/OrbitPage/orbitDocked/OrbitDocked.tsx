import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome/OrbitHome'
import { OrbitSettings } from './orbitSettings/OrbitSettings'
import { OrbitHomeHeader } from './orbitHome/OrbitHomeHeader'
import { OrbitHeader } from '../orbitHeader/OrbitHeader'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../PaneManagerStore'
import { BORDER_RADIUS } from '../../../constants'
import { SearchStore } from './SearchStore'
import { OrbitStore } from '../OrbitStore'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitDockedChrome } from './OrbitDockedChrome'
import { OrbitOnboard } from './orbitOnboard/OrbitOnboard'
import { Logger } from '@mcro/logger'
import { AppsStore } from '../../../stores/AppsStore'
import { SpaceNav } from './SpaceNav'
// import notch from './notch.png'

const log = new Logger('OrbitDocked')

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  appStore?: OrbitStore
  appsStore?: AppsStore
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

@view.attach('appsStore', 'paneManagerStore', 'searchStore')
@view
class OrbitDockedContents extends React.Component<Props> {
  isSelected = index => index === this.props.paneManagerStore.paneIndex

  onSelect = (index, config) => {
    this.props.paneManagerStore.setPaneIndex(index)
    console.log('selected', index, config)
  }

  render() {
    const { paneManagerStore } = this.props
    return (
      <>
        <OrbitHeader borderRadius={BORDER_RADIUS} after={<OrbitHomeHeader />} />
        <OrbitDockedInner id="above-content" style={{ height: window.innerHeight }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Interactive disabled={/^(settings|onboard)$/.test(paneManagerStore.activePane)}>
              <SpaceNav />
            </Interactive>
            <OrbitOnboard name="onboard" />
            <OrbitHome name="home" />
            <OrbitSettings name="settings" />
          </div>
        </OrbitDockedInner>
      </>
    )
  }
}

class OrbitDockedStore {
  // when we open an app window we have to change our strategy for showing/hiding orbit
  // with only one open we just use electron show/hide entire app, so return true
  // otherwise we use in-app logic here
  shouldShowOrbitDocked = react(
    () => [App.appsState.length, App.orbitState.docked],
    ([numApps, isDocked]) => {
      if (numApps === 1) {
        return true
      } else {
        return isDocked
      }
    },
  )
}

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
    log.info('orbit', '-------- DOCKED ------------')
    const theme = App.state.darkTheme ? 'clearDark' : 'clearLight'
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
