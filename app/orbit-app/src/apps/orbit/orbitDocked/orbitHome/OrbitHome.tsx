import * as React from 'react'
import { view } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../SelectionStore'
import { AppsStore } from '../../../AppsStore'
import { VerticalSpace, OrbitNavVerticalPad } from '../../../../views'
import { SearchStore } from '../SearchStore'
import { OrbitExplore } from './orbitExplore/OrbitExplore'
import { Orbital } from '../../../../views/Orbital'

type Props = {
  name: string
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  appsStore?: AppsStore
}

@view
export class OrbitHome extends React.Component<Props> {
  render() {
    console.log('OrbitHome Render')
    return (
      <SubPane
        name="home"
        fadeBottom
        before={<OrbitNavVerticalPad />}
        paddingLeft={6}
        paddingRight={6}
      >
        <Orbital key={0} type="isocahedron" />
        <OrbitExplore />
        <VerticalSpace />
      </SubPane>
    )
  }
}
