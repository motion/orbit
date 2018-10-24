import * as React from 'react'
import { view } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { OrbitNavVerticalPad, Title } from '../../../../views'
import { OrbitExplore } from './orbitExplore/OrbitExplore'
import { OrbitDirectory } from '../OrbitDirectory'
import { ListApp } from '../../../../apps/list/ListApp'
import { TopicsApp } from '../../../../apps/topics/TopicsApp'
import { MeApp } from '../../../../apps/me/MeApp'
import { OrbitCard } from '../../../../views/OrbitCard'
import { Grid, Text } from '@mcro/ui'

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
          paddingLeft={10}
          paddingRight={10}
        >
          <OrbitDirectory />
          <Lip />
        </SubPane>
        <SubPane name="topics" before={<OrbitNavVerticalPad />} paddingLeft={0} paddingRight={0}>
          <TopicsApp />
          <Lip />
        </SubPane>
        <SubPane
          preventScroll
          name="list"
          before={<OrbitNavVerticalPad />}
          paddingLeft={0}
          paddingRight={0}
        >
          <ListApp />
          <Lip />
        </SubPane>
        <SubPane name="help" before={<OrbitNavVerticalPad />} paddingLeft={0} paddingRight={0}>
          help me
          <Lip />
        </SubPane>
        <SubPane name="new" before={<OrbitNavVerticalPad />} paddingLeft={12} paddingRight={12}>
          <Title>Add app</Title>
          <Grid
            gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))"
            gridAutoRows={90}
            gridGap={6}
            margin={[5, -4]}
          >
            {[
              {
                title: 'List',
                icon: 'list',
                description: `Organizable list you sort and control how it looks.`,
              },
              {
                title: 'Item',
                icon: 'item',
                description: `Show the content of a single bit.`,
              },
              {
                title: 'Search',
                icon: 'zoom',
                description: `Show the results of a search as a list.`,
              },
              {
                title: 'Search List',
                icon: 'zoom',
                description: `Horizontal list of queries you organize and pin.`,
              },
              {
                title: 'Topic List',
                icon: 'chat',
                description: `Custom list of topics that lead into searches.`,
              },
              {
                title: 'Directory',
                icon: 'index',
                description: `Directory of People or Lists for navigation.`,
              },
            ].map((item, index) => (
              <OrbitCard
                key={index}
                titleProps={{ fontSize: 18, fontWeight: 300 }}
                title={item.title}
                icon={item.icon}
                inGrid
                direct
                index={index}
              >
                <Text size={1.15} alpha={0.6}>
                  {item.description}
                </Text>
              </OrbitCard>
            ))}
          </Grid>
          <Lip />
        </SubPane>
      </>
    )
  }
}
