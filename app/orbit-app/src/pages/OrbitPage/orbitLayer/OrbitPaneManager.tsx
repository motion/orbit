import * as React from 'react'
import { view, attach, provide } from '@mcro/black'
import { OrbitSettings } from './orbitSettings/OrbitSettings'
import { OrbitHeader } from './OrbitHeader'
import { BORDER_RADIUS } from '../../../constants'
import { SearchStore } from '../../../apps/search/SearchStore'
import { OrbitWindowStore } from '../../../stores/OrbitWindowStore'
import { OrbitOnboard } from './OrbitOnboard'
import { SourcesStore } from '../../../stores/SourcesStore'
import { SpaceNav, SpaceNavHeight } from './SpaceNav'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { SubPane } from '../../../components/SubPane'
import { OrbitStore } from '../../../stores/OrbitStore'
import { MainShortcutHandler } from '../../../components/shortcutHandlers/MainShortcutHandler'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { App } from '../../../apps/App'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  viewStore?: OrbitWindowStore
  sourcesStore?: SourcesStore
  orbitStore?: OrbitStore
  queryStore?: QueryStore
}

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

@attach('orbitStore', 'queryStore', 'sourcesStore', 'searchStore', 'selectionStore')
@provide({
  paneManagerStore: PaneManagerStore,
})
@view
export class OrbitPaneManager extends React.Component<Props> {
  isSelected = index => index === this.props.paneManagerStore.paneIndex

  onSelect = (index, config) => {
    this.props.paneManagerStore.setPaneIndex(index)
    console.log('selected', index, config)
  }

  render() {
    const { paneManagerStore } = this.props
    return (
      <MainShortcutHandler>
        <OrbitHeader borderRadius={BORDER_RADIUS} />
        <OrbitDockedInner id="above-content" style={{ height: window.innerHeight }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Interactive disabled={/^(settings|onboard)$/.test(paneManagerStore.activePane)}>
              <SpaceNav />
            </Interactive>
            <OrbitOnboard name="onboard" />
            {this.props.orbitStore.activeSpace.panes.map(pane => {
              return (
                <SubPane
                  name={pane.type}
                  key={pane.type}
                  before={<SpaceNavHeight />}
                  paddingLeft={0}
                  paddingRight={0}
                  {...pane.props}
                >
                  <App id={pane.id} title={pane.title} type={pane.type} />
                </SubPane>
              )
            })}
            <OrbitSettings name="settings" />
          </div>
        </OrbitDockedInner>
      </MainShortcutHandler>
    )
  }
}
