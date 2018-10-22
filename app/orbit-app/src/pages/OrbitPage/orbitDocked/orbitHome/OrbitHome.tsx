import * as React from 'react'
import { view } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../SelectionStore'
import { AppsStore } from '../../../../stores/AppsStore'
import { VerticalSpace, OrbitNavVerticalPad, Title } from '../../../../views'
import { SearchStore } from '../SearchStore'
import { OrbitExplore } from './orbitExplore/OrbitExplore'
import { View } from '@mcro/ui'

type Props = {
  name: string
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  appsStore?: AppsStore
}

@view.attach('appsStore', 'paneManagerStore')
@view
export class OrbitHome extends React.Component<Props> {
  render() {
    const { appsStore } = this.props
    console.log('OrbitHome Render')
    return (
      <>
        <SubPane name="home" before={<OrbitNavVerticalPad />} paddingLeft={6} paddingRight={6}>
          <OrbitExplore />
          <VerticalSpace />
          <VerticalSpace small />
        </SubPane>
        {appsStore.activeIntegrations.map(app => (
          <SubPane
            name={app.display.name}
            key={app.setting.id}
            before={<OrbitNavVerticalPad />}
            paddingLeft={6}
            paddingRight={6}
          >
            <View padding={[0, 6]}>
              <Title>{app.display.name}</Title>
            </View>
            <OrbitExplore />
            <VerticalSpace />
            <VerticalSpace small />
          </SubPane>
        ))}
      </>
    )
  }
}
