import * as React from 'react'
import { view } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { OrbitNavVerticalPad } from '../../../../views'
import { OrbitExplore } from './orbitExplore/OrbitExplore'
import { OrbitDirectory } from '../OrbitDirectory'
import { ListApp } from '../../../../apps/list/ListApp'
import { TopicsApp } from '../../../../apps/topics/TopicsApp'
import { MeApp } from '../../../../apps/me/MeApp'

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
        <SubPane name="home" before={<OrbitNavVerticalPad />} paddingLeft={6} paddingRight={6}>
          <OrbitExplore />
          <Lip />
        </SubPane>
        <SubPane name="me" before={<OrbitNavVerticalPad />} paddingLeft={6} paddingRight={6}>
          <MeApp />
          <Lip />
        </SubPane>
        <SubPane
          name="directory"
          before={<OrbitNavVerticalPad />}
          paddingLeft={12}
          paddingRight={12}
        >
          <OrbitDirectory />
          <Lip />
        </SubPane>
        <SubPane name="topics" before={<OrbitNavVerticalPad />} paddingLeft={0} paddingRight={0}>
          <TopicsApp />
          <Lip />
        </SubPane>
        <SubPane name="list" before={<OrbitNavVerticalPad />} paddingLeft={0} paddingRight={0}>
          <ListApp />
          <Lip />
        </SubPane>
      </>
    )
  }
}
