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
import { SelectableCarousel } from '../../../../components/SelectableCarousel'
import { OrbitOrb } from '../orbitSettings/OrbitOrb'
import { OrbitAppIconCard } from '../views/OrbitAppIconCard'
import { OrbitIcon } from '../../../../views/OrbitIcon'

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
        <View position="relative" zIndex={1000} margin={[8, 0, 0]}>
          <SelectableCarousel
            cardWidth={56}
            cardHeight={56}
            cardSpace={0}
            horizontalPadding={20}
            CardView={OrbitAppIconCard}
            items={[
              {
                title: 'Orbit',
                children: <OrbitOrb size={28} background={'#DDADDA'} color="#985FC9" />,
              },
              ...appsStore.activeApps.map(app => ({
                title: app.display.name,
                children: <OrbitIcon size={28} name={app.integration} />,
              })),
              // {
              //   title: 'Gmail',
              //   children: <OrbitIcon size={16} name="gmail" />,
              // },
            ]}
          />
        </View>
        <SubPane name="home" before={<OrbitNavVerticalPad />} paddingLeft={6} paddingRight={6}>
          <View padding={[0, 6]}>
            <Title>Orbit</Title>
          </View>
          <OrbitExplore />
          <VerticalSpace />
          <VerticalSpace small />
        </SubPane>
        {appsStore.activeApps.map(app => (
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
