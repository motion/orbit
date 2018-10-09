import * as React from 'react'
import { view } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore, SelectionGroup } from '../SelectionStore'
import { Text } from '@mcro/ui'
import { OrbitCarouselSection } from './OrbitCarouselSection'
import { AppsStore } from '../../../AppsStore'
import { OrbitCard } from '../../../../views/OrbitCard'
import { OrbitAppIconCard } from '../views/OrbitAppIconCard'
import { OrbitMasonry } from '../../../../views/OrbitMasonry'
import { Unpad } from '../../../../views/Unpad'
import { VerticalSpace } from '../../../../views'
import { SearchStore } from '../SearchStore'
import { OrbitSearchMasonry } from './OrbitSearchMasonry'
import { OrbitSearchQuickResults } from '../orbitSearch/OrbitSearchQuickResults'
import { OrbitNav } from './OrbitNav';
import { OrbitExplore } from './orbitExplore/OrbitExplore';

type Props = {
  name: string
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  homeStore?: OrbitHomeStore
  appsStore?: AppsStore
}

const fakeData = [
  {
    id: 0,
    location: '#status',
    integration: 'slack',
    topics: [
      'repositories',
      'offerings',
      'weight.surge.sh',
      'dimensions',
      'observeMany',
      'debounce',
    ],
    counts: 22,
    people: [
      { id: 0, photo: 'https://avatars0.githubusercontent.com/u/1280719?v=4', name: 'JulianGindi' },
      {
        id: 1,
        photo:
          'https://secure.gravatar.com/avatar/2eb48ec7c59931a508930b78ab0f6f96.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0002-512.png',
        name: 'Andrew Hsu',
      },
    ],
  },
  {
    id: 0,
    location: 'atom',
    integration: 'github',
    topics: ['Object', 'dirname', 'deprecated', 'SyntaxError', 'observeMany', 'debounce'],
    counts: 18,
    people: [
      { id: 0, photo: 'https://avatars0.githubusercontent.com/u/1280719?v=4', name: 'JulianGindi' },
      {
        id: 1,
        photo:
          'https://secure.gravatar.com/avatar/2eb48ec7c59931a508930b78ab0f6f96.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0002-512.png',
        name: 'Andrew Hsu',
      },
    ],
  },
  {
    id: 0,
    location: '#general',
    integration: 'slack',
    topics: ['syncer', 'running', 'execution', 'dimensions', 'observeMany', 'debounce'],
    counts: 22,
    people: [
      { id: 0, photo: 'https://avatars0.githubusercontent.com/u/1280719?v=4', name: 'JulianGindi' },
      {
        id: 1,
        photo:
          'https://secure.gravatar.com/avatar/2eb48ec7c59931a508930b78ab0f6f96.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0002-512.png',
        name: 'Andrew Hsu',
      },
    ],
  },
  {
    id: 0,
    location: '#status',
    integration: 'slack',
    topics: [
      'repositories',
      'offerings',
      'weight.surge.sh',
      'dimensions',
      'observeMany',
      'debounce',
    ],
    counts: 22,
    people: [
      { id: 0, icon: 'https://avatars0.githubusercontent.com/u/1280719?v=4', name: 'JulianGindi' },
      {
        id: 1,
        icon:
          'https://secure.gravatar.com/avatar/2eb48ec7c59931a508930b78ab0f6f96.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0002-512.png',
        name: 'Andrew Hsu',
      },
    ],
  },
  {
    id: 0,
    location: 'atom',
    integration: 'github',
    topics: ['Object', 'dirname', 'deprecated', 'SyntaxError', 'observeMany', 'debounce'],
    counts: 18,
    people: [
      { id: 0, icon: 'https://avatars0.githubusercontent.com/u/1280719?v=4', name: 'JulianGindi' },
      {
        id: 1,
        icon:
          'https://secure.gravatar.com/avatar/2eb48ec7c59931a508930b78ab0f6f96.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0002-512.png',
        name: 'Andrew Hsu',
      },
    ],
  },
  {
    id: 0,
    location: '#general',
    integration: 'slack',
    topics: ['syncer', 'running', 'execution', 'dimensions', 'observeMany', 'debounce'],
    counts: 22,
    people: [
      { id: 0, icon: 'https://avatars0.githubusercontent.com/u/1280719?v=4', name: 'JulianGindi' },
      {
        id: 1,
        icon:
          'https://secure.gravatar.com/avatar/2eb48ec7c59931a508930b78ab0f6f96.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0002-512.png',
        name: 'Andrew Hsu',
      },
    ],
  },
]

class OrbitHomeStore {
  props: Props
}

@view.attach('searchStore', 'selectionStore', 'paneManagerStore', 'appsStore')
@view.attach({
  homeStore: OrbitHomeStore,
})
@view
export class OrbitHome extends React.Component<Props> {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    this.props.homeStore.reorder(result.source.index, result.destination.index)
  }

  renderApps({ name, items, startIndex }: SelectionGroup) {
    const { homeStore } = this.props
    return (
      <>
        <OrbitCarouselSection
          startIndex={startIndex}
          items={items}
          homeStore={homeStore}
          categoryName={name === 'Apps' ? null : name}
          cardHeight={30}
          cardWidth={30}
          cardSpace={5}
          CardView={OrbitAppIconCard}
          cardProps={{
            hideTitle: true,
          }}
        />
        <VerticalSpace small />
      </>
    )
  }

  render() {
    console.log('OrbitHome Render')
    // const { searchStore } = this.props
    // if (searchStore.hasQueryVal) {
    //   console.log('has query val...')
    //   return (
    //     <SubPane name="home" fadeBottom before={before}>
    //       <OrbitSearchQuickResults />
    //       <OrbitSearchMasonry />
    //     </SubPane>
    //   )
    // }
    const navSpace = <div style={{ height: 38, pointerEvents: 'none' }} />
    return (
      <>
        <OrbitNav />
        <SubPane name="home" fadeBottom>
          {navSpace}
          {/* {results[0].name === 'Apps' ? this.renderApps(results[0]) : null} */}
          <Unpad>
            <OrbitSearchQuickResults />
            <OrbitMasonry
              items={fakeData.map((item, index) => (
                <OrbitCard
                  key={index}
                  index={index}
                  title={item.location}
                  people={item.people}
                  icon={item.integration}
                  subtitle={<>{item.counts} new</>}
                  date={new Date()}
                >
                  <Text size={1.2}>{item.topics.join(' ')}</Text>
                </OrbitCard>
              ))}
            />
          </Unpad>
          <VerticalSpace />
        </SubPane>
        <SubPane name="explore" fadeBottom>
          {navSpace}
          <OrbitExplore />
          <VerticalSpace />
        </SubPane>
      </>
    )
  }
}
