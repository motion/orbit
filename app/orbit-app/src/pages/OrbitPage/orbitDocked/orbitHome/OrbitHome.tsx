import * as React from 'react'
import { view } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { OrbitExplore } from './orbitExplore/OrbitExplore'
import { OrbitDirectory } from '../OrbitDirectory'
import { ListApp } from '../../../../apps/list/ListApp'
import { TopicsApp } from '../../../../apps/topics/TopicsApp'
import { NewApp } from '../../../../apps/new/NewApp'
import { OrbitSearchResults } from '../orbitSearch/OrbitSearchResults'
import { SpaceNavHeight } from '../SpaceNav'

type Props = {
  name: string
  paneManagerStore?: PaneManagerStore
}

const Lip = view({
  height: 24,
})

@view.attach('paneManagerStore')
@view
export class OrbitHome extends React.Component<Props> {
  render() {
    console.log('OrbitHome Render')
    return (
      <>
        <SubPane name="home" before={<SpaceNavHeight />} paddingLeft={6} paddingRight={6}>
          <OrbitExplore />
          <Lip />
        </SubPane>
        <SubPane
          name="search"
          preventScroll
          before={<SpaceNavHeight />}
          paddingLeft={0}
          paddingRight={0}
        >
          <OrbitSearchResults />
          <Lip />
        </SubPane>
        <SubPane name="people" before={<SpaceNavHeight />} paddingLeft={0} paddingRight={0}>
          <OrbitDirectory />
          <Lip />
        </SubPane>
        <SubPane name="topics" before={<SpaceNavHeight />} paddingLeft={0} paddingRight={0}>
          <TopicsApp />
          <Lip />
        </SubPane>
        <SubPane
          preventScroll
          name="onboarding"
          before={<SpaceNavHeight />}
          paddingLeft={0}
          paddingRight={0}
        >
          <ListApp />
          <Lip />
        </SubPane>
        <SubPane name="help" before={<SpaceNavHeight />} paddingLeft={0} paddingRight={0}>
          help me
          <Lip />
        </SubPane>
        <SubPane name="new" before={<SpaceNavHeight />} paddingLeft={0} paddingRight={0}>
          <NewApp />
          <Lip />
        </SubPane>
      </>
    )
  }
}
