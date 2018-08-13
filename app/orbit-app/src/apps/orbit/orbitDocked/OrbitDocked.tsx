import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitHome } from './orbitHome/OrbitHome'
import { OrbitSettings } from './orbitSettings/OrbitSettings'
import { OrbitHomeHeader } from './orbitHome/OrbitHomeHeader'
import { OrbitHeader } from '../orbitHeader/OrbitHeader'
import { OrbitSearchResults } from './orbitSearch/OrbitSearchResults'
import { OrbitDirectory } from './OrbitDirectory'
import { OrbitApps } from './OrbitApps'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../PaneManagerStore'
import { BORDER_RADIUS } from '../../../constants'
import { SearchStore } from '../../../stores/SearchStore'
import { AppStore } from '../../../stores/AppStore'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitFilterBar } from '../orbitHeader/OrbitFilterBar'
import { OrbitDockedChrome } from './OrbitDockedChrome'
import { OrbitOnboard } from './orbitOnboard/OrbitOnboard'
import { SelectionStore } from '../../../stores/SelectionStore'
import { QueryStore } from '../../../stores/QueryStore'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  appStore?: AppStore
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

// class OrbitDockedStore {
//   animationState = react(
//     () => App.orbitState.docked,
//     async (visible, { sleep, setValue }) => {
//       // hmr already showing
//       if (visible && this.animationState.visible) {
//         throw react.cancel
//       }
//       // old value first to setup for transition
//       setValue({ willAnimate: true, visible: !visible })
//       await sleep(32)
//       // new value, start transition
//       setValue({ willAnimate: true, visible })
//       await sleep(App.animationDuration * 2)
//       // done animating, reset
//       setValue({ willAnimate: false, visible })
//       // this would do the toggle after the animation, trying out doing it before to see if its faster
//       // App.sendMessage(
//       //   Electron,
//       //   visible ? Electron.messages.FOCUS : Electron.messages.DEFOCUS,
//       // )
//     },
//     {
//       immediate: true,
//       log: false,
//       defaultValue: { willAnimate: false, visible: App.orbitState.docked },
//     },
//   )
// }

@view.attach('appStore', 'integrationSettingsStore')
// selection and query are used by SearchStore
@view.provide({
  selectionStore: SelectionStore,
  queryStore: QueryStore,
})
@view.provide({
  searchStore: SearchStore,
  paneManagerStore: PaneManagerStore,
})
@view
export class OrbitDocked extends React.Component<Props> {
  render() {
    const { appStore, searchStore, paneManagerStore } = this.props
    // log('DOCKED ------------', store.animationState)
    return (
      <UI.Theme name="dark">
        <OrbitDockedFrame visible={App.orbitState.docked}>
          <OrbitDockedChrome appStore={appStore} />
          <OrbitDockedInnerFrame
            borderBottomRadius={BORDER_RADIUS}
            flex={1}
            visible={App.orbitState.docked}
          >
            <OrbitHeader
              borderRadius={BORDER_RADIUS}
              after={<OrbitHomeHeader paneManagerStore={paneManagerStore} />}
            />
            <OrbitFilterBar
              paneManagerStore={paneManagerStore}
              filterStore={searchStore.searchFilterStore}
            />
            <OrbitDockedInner style={{ height: window.innerHeight }}>
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
