import * as React from 'react'
import { view, StoreContext, react } from '@mcro/black'
import { OrbitSettings } from './orbitSettings/OrbitSettings'
import { OrbitHeader } from './OrbitHeader'
import { BORDER_RADIUS } from '../../../constants'
import { OrbitOnboard } from './OrbitOnboard'
import { SpaceNav, SpaceNavHeight } from './SpaceNav'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { SubPane } from '../../../components/SubPane'
import { AppPanes } from '../../../stores/SpaceStore'
import { MainShortcutHandler } from '../../../components/shortcutHandlers/MainShortcutHandler'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { AppView } from '../../../apps/AppView'
import { useStore } from '@mcro/use-store'
import { AppActions } from '../../../actions/AppActions'

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

class OrbitPaneManagerStore {
  props: {
    paneManagerStore: PaneManagerStore
    queryStore: QueryStore
  }

  setActivePaneOnTrigger = react(
    () => this.props.queryStore.query[0],
    firstChar => {
      for (const { type, trigger } of AppPanes) {
        if (trigger && trigger === firstChar) {
          this.props.paneManagerStore.setActivePane(type)
          return
        }
      }
    },
  )

  setTrayTitleOnPaneChange = react(
    () => this.props.paneManagerStore.activePane === 'onboard',
    onboard => {
      if (onboard) {
        AppActions.setContextMessage('Welcome to Orbit...')
      } else {
        AppActions.setContextMessage('Orbit')
      }
    },
  )
}

export function OrbitPaneManager() {
  const { queryStore, paneManagerStore } = React.useContext(StoreContext)
  useStore(OrbitPaneManagerStore, { queryStore, paneManagerStore })
  log(`------------ OrbitPaneManager......`)
  return (
    <MainShortcutHandler>
      <OrbitHeader borderRadius={BORDER_RADIUS} />
      <OrbitDockedInner id="above-content" style={{ height: window.innerHeight }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <SpaceNav />
          <OrbitOnboard name="onboard" />
          {AppPanes.map(pane => {
            return (
              <SubPane
                id={pane.id}
                type={pane.type}
                key={pane.type}
                before={<SpaceNavHeight />}
                paddingLeft={0}
                paddingRight={0}
                {...pane.props}
              >
                <AppView view="index" id={pane.id} title={pane.title} type={pane.type} />
              </SubPane>
            )
          })}
          <OrbitSettings />
        </div>
      </OrbitDockedInner>
    </MainShortcutHandler>
  )
}
