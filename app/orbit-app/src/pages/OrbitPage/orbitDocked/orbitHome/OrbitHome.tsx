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
import { OrbitStore } from '../../../../stores/OrbitStore'

type Props = {
  name: string
  paneManagerStore?: PaneManagerStore
  orbitStore?: OrbitStore
}

const Lip = view({
  height: 24,
})

const apps = {
  list: ListApp,
}

@attach('orbitStore', 'paneManagerStore')
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
        {this.props.orbitStore.activeSpace.panes.filter(x => !x.static).map(pane => {
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
