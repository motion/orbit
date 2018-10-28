import * as React from 'react'
import { view, attach } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { OrbitExplore } from './orbitExplore/OrbitExplore'
import { OrbitDirectory } from '../OrbitDirectory'
import { ListApp } from '../../../../apps/list/ListApp'
import { ListsApp } from '../../../../apps/lists/ListsApp'
import { NewApp } from '../../../../apps/new/NewApp'
import { OrbitSearchResults } from '../orbitSearch/OrbitSearchResults'
import { SpaceNavHeight } from '../SpaceNav'
import { SpaceStore } from '../../../../stores/SpaceStore'

type Props = {
  name: string
  paneManagerStore?: PaneManagerStore
  spaceStore?: SpaceStore
}

const Lip = view({
  height: 24,
})

const apps = {
  list: ListApp,
}

@attach('spaceStore', 'paneManagerStore')
@view
export class OrbitHome extends React.Component<Props> {
  render() {
    return (
      <>
        <SubPane name="home" before={<SpaceNavHeight />} paddingLeft={6} paddingRight={6}>
          <OrbitExplore />
        </SubPane>
        {/* <SubPane
          name="search"
          preventScroll
          before={<SpaceNavHeight />}
          paddingLeft={0}
          paddingRight={0}
        >
          <OrbitSearchResults />
        </SubPane>
        <SubPane name="people" before={<SpaceNavHeight />} paddingLeft={0} paddingRight={0}>
          <OrbitDirectory />
        </SubPane>
        <SubPane
          preventScroll
          name="lists"
          before={<SpaceNavHeight />}
          paddingLeft={0}
          paddingRight={0}
        >
          <ListsApp />
        </SubPane>
        {this.props.spaceStore.activeSpace.panes.filter(x => !x.static).map(pane => {
          const App = apps[pane.type]
          return (
            <SubPane
              name={pane.id}
              key={pane.id}
              before={<SpaceNavHeight />}
              paddingLeft={0}
              paddingRight={0}
            >
              <App title={pane.title} />
            </SubPane>
          )
        })}
        <SubPane name="new" before={<SpaceNavHeight />} paddingLeft={0} paddingRight={0}>
          <NewApp />
          <Lip />
        </SubPane> */}
      </>
    )
  }
}
