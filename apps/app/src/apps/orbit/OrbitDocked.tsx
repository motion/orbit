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
import { PaneManagerStore } from './PaneManagerStore'
import { BORDER_RADIUS } from '../../constants'
import { SearchStore } from '../../stores/SearchStore'
import { AppStore } from '../../stores/AppStore'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitFilterBar } from './orbitHeader/OrbitFilterBar'

const SHADOW_PAD = 100
const DOCKED_SHADOW = [0, 0, SHADOW_PAD, [0, 0, 0, 0.45]]

const Frame = view(UI.Col, {
  position: 'absolute',
  top: 10,
  right: 10,
  borderRadius: BORDER_RADIUS + 2,
  border: [3, [0, 0, 0, 0.08]],
  zIndex: 2,
  flex: 1,
  pointerEvents: 'none',
  width: ORBIT_WIDTH,
  opacity: 0,
  transition: 'bottom ease 80ms',
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

const Border = view({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: Number.MAX_SAFE_INTEGER,
  pointerEvents: 'none',
  borderRadius: BORDER_RADIUS - 1,
})

Border.theme = ({ theme }) => {
  const borderColor = theme.base.background.darken(0.3)
  const borderShadow = ['inset', 0, 0, 0, 0.5, borderColor]
  const lightBg = theme.base.background.lighten(1)
  const borderGlow = ['inset', 0, 0.5, 0, 0.5, lightBg]
  return {
    boxShadow: [borderShadow, borderGlow, DOCKED_SHADOW],
  }
}

const FrameBackground = view(UI.FullScreen, {
  zIndex: -1,
  borderRadius: BORDER_RADIUS + 1,
})

FrameBackground.theme = ({ theme }) => ({
  background: theme.base.background,
})

// having this have -20 margin on sides
// means we have nice shadows on inner content
// that overlap the edge of the frame and dont cut off
// but still hide things that go below the bottom as it should
const OrbitInner = view({
  position: 'relative',
  zIndex: 4,
  overflow: 'hidden',
  pointerEvents: 'none',
  margin: [-20, -20, 0, -20],
  padding: [20, 20, 0, 20],
  flex: 1,
  // this can be a lot more because theres padding left and right
  // and so this lets us have the top/side overflow but still cut off bottom
  borderBottomLeftRadius: 59,
  borderBottomRightRadius: 59,
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
    const contentBottom = Math.max(
      // always leave 40px room at bottom
      // leaving a little room at the bottom makes it feel much lighter
      50,
      window.innerHeight - appStore.contentHeight - 12,
    )
    return (
      <>
        <Frame
          visible={animationState.visible}
          willAnimate={animationState.willAnimate}
          bottom={searchStore.searchState.query ? 10 : contentBottom}
        >
          <Border />
          <FrameBackground />
          <UI.View borderRadius={BORDER_RADIUS} flex={1}>
            <OrbitHeader
              borderRadius={BORDER_RADIUS}
              after={
                <>
                  <OrbitHomeHeader paneStore={paneStore} />
                </>
              }
            />
            <OrbitFilterBar
              filters={[
                { name: 'Jira', type: 'active' },
                { name: 'Nate', type: 'active' },
                { name: 'Last Week', type: 'suggested' },
                { name: 'Last Month', type: 'suggested' },
                { name: 'Umed', type: 'suggested' },
                { name: 'Slack', type: 'suggested' },
                { name: 'Document', type: 'suggested' },
              ]}
            />
            <OrbitInner height={window.innerHeight}>
              <UI.View position="relative" flex={1} overflow="hidden">
                <OrbitHome name="home" paneStore={paneStore} />
                <OrbitDirectory name="directory" paneStore={paneStore} />
                <OrbitSearchResults name="docked-search" />
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
