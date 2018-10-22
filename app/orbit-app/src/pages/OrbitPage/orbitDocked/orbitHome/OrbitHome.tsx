import * as React from 'react'
import { view } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { VerticalSpace, OrbitNavVerticalPad } from '../../../../views'
import { OrbitExplore } from './orbitExplore/OrbitExplore'
import { OrbitDirectory } from '../OrbitDirectory'
import { OrbitSearchMasonry } from './OrbitSearchMasonry'

type Props = {
  name: string
  paneManagerStore?: PaneManagerStore
}

@view.attach('paneManagerStore')
@view
export class OrbitHome extends React.Component<Props> {
  render() {
    console.log('OrbitHome Render')
    return (
      <>
        <SubPane name="home" before={<OrbitNavVerticalPad />} paddingLeft={6} paddingRight={6}>
          <OrbitExplore />
          <VerticalSpace />
          <VerticalSpace small />
        </SubPane>
        <SubPane
          name="directory"
          before={<OrbitNavVerticalPad />}
          paddingLeft={12}
          paddingRight={12}
        >
          <OrbitDirectory />
          <VerticalSpace />
        </SubPane>
        <SubPane name="topics" before={<OrbitNavVerticalPad />} paddingLeft={0} paddingRight={0}>
          <OrbitSearchMasonry />
          <VerticalSpace />
        </SubPane>
      </>
    )
  }
}
