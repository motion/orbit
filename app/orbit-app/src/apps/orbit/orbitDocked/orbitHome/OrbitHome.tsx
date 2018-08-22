import * as React from 'react'
import { view, react, compose, ensure } from '@mcro/black'
import { BitRepository, PersonRepository } from '../../../../repositories'
import { SubTitle, SuggestionBarVerticalPad } from '../../../../views'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import {
  SelectionStore,
  SelectionGroup,
} from '../../../../stores/SelectionStore'
import { capitalize } from 'lodash'
import { View } from '@mcro/ui'
import { SelectableCarousel } from '../../../../components/SelectableCarousel'

type Props = {
  name: string
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  homeStore?: OrbitHomeStore
}

const findManyType = integration =>
  BitRepository.find({
    take: 5,
    where: {
      integration,
    },
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
  })

class OrbitHomeStore {
  props: Props

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', isActive)
      this.props.selectionStore.setResults(this.results)
    },
  )

  get results() {
    let results: SelectionGroup[] = []
    for (const name in this.following) {
      results.push({ name, type: 'row', items: this.following[name].items })
    }
    return results
  }

  following = react(
    async () => {
      const people = await PersonRepository.find({
        order: { createdAt: 'DESC' },
        take: 10,
      })
      const [slack, drive, github, confluence, jira, gmail] = await Promise.all(
        [
          findManyType('slack'),
          findManyType('gdocs'),
          findManyType('github'),
          findManyType('confluence'),
          findManyType('jira'),
          findManyType('gmail'),
        ],
      )
      // only return ones with results
      const all = { people, slack, drive, github, confluence, jira, gmail }
      const res = {} as any
      let curIndex = 0
      for (const name in all) {
        if (all[name] && all[name].length) {
          const items = all[name]
          const startIndex = curIndex
          const endIndex = startIndex + items.length
          res[capitalize(name)] = { items, startIndex, endIndex }
          curIndex += items.length
        }
      }
      return res
    },
    {
      defaultValue: {},
    },
  )
}

const Section = view()

const decorator = compose(
  view.attach('subPaneStore'),
  view,
)
const OrbitHomeCarouselSection = decorator(
  ({ selectionStore, subPaneStore, homeStore, categoryName }) => {
    const { items, startIndex } = homeStore.following[categoryName]
    return (
      <Section key={categoryName}>
        <SubTitle margin={0} padding={[10, 0, 0]}>
          {categoryName}
        </SubTitle>
        <Unpad>
          <SelectableCarousel
            items={items}
            offset={startIndex}
            horizontalPadding={16}
            isActiveStore={subPaneStore}
            resetOnInactive
            cardProps={{
              getIndex: selectionStore.getIndexForItem,
              hide: { body: true },
              titleFlex: 1,
            }}
          />
        </Unpad>
      </Section>
    )
  },
)

const Unpad = view({
  margin: [0, -16],
})

@view.attach('searchStore', 'selectionStore', 'paneManagerStore')
@view.attach({
  homeStore: OrbitHomeStore,
})
@view
export class OrbitHome extends React.Component<Props> {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  render() {
    const { homeStore, selectionStore } = this.props
    console.log('HOME RENDER')
    return (
      <SubPane name="home" fadeBottom>
        <SuggestionBarVerticalPad />
        {Object.keys(homeStore.following).map(categoryName => (
          <OrbitHomeCarouselSection
            key={categoryName}
            selectionStore={selectionStore}
            homeStore={homeStore}
            categoryName={categoryName}
          />
        ))}
        {/* this is a nice lip effect */}
        <View height={20} />
      </SubPane>
    )
  }
}
