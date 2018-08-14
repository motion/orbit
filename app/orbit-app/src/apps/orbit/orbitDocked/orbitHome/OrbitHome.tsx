import * as React from 'react'
import { view, react } from '@mcro/black'
import { BitRepository } from '../../../../repositories'
import { SubTitle } from '../../../../views'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import {
  SelectionStore,
  SelectionGroup,
} from '../../../../stores/SelectionStore'
import { Carousel } from '../../../../components/Carousel'
import { capitalize } from 'lodash'
import { View } from '@mcro/ui'

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
      if (!isActive) throw react.cancel
      this.props.selectionStore.setResults(this.results)
    },
  )

  get results() {
    let results: SelectionGroup[] = []
    for (const name in this.following) {
      results.push({ name, type: 'row', items: this.following[name] })
    }
    return results
  }

  following = react(
    async () => {
      const [slack, drive, github, confluence, jira] = await Promise.all([
        findManyType('slack'),
        findManyType('gdocs'),
        findManyType('github'),
        findManyType('confluence'),
        findManyType('jira'),
      ])
      // only return ones with results
      const all = { slack, drive, github, confluence, jira }
      const res = {} as any
      for (const name in all) {
        if (all[name] && all[name].length) {
          const items = all[name]
          res[capitalize(name)] = items
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
        {Object.keys(homeStore.following).map(categoryName => {
          const items = homeStore.following[categoryName]
          return (
            <Section key={categoryName}>
              <SubTitle margin={0} padding={[10, 0, 0]}>
                {categoryName}
              </SubTitle>
              <Unpad>
                <Carousel
                  items={items}
                  horizontalPadding={16}
                  cardProps={{
                    getIndex: selectionStore.getIndexForItem,
                    padding: 9,
                    hide: { body: true },
                    titleFlex: 1,
                  }}
                />
              </Unpad>
            </Section>
          )
        })}
        {!!homeStore.results.length && <View height={15} />}
      </SubPane>
    )
  }
}
