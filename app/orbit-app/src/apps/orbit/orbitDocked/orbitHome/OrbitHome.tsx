import * as React from 'react'
import { view, react } from '@mcro/black'
import { BitRepository } from '../../../../repositories'
import { SubTitle } from '../../../../views'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import {
  SelectionStore,
  SelectionResult,
  SelectionResultGrid,
  SelectionResultGridItem,
  SelectionResultRaw,
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
    { immediate: true },
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
      let offset = 0
      for (const name in all) {
        if (all[name] && all[name].length) {
          const items = all[name]
          res[capitalize(name)] = {
            items,
            offset,
          }
          offset += items.length
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
  padding: [0, 0, 0, 14],
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
    const { homeStore } = this.props
    return (
      <SubPane name="home" fadeBottom>
        {Object.keys(homeStore.following).map(categoryName => {
          const category = homeStore.following[categoryName]
          return (
            <Section key={categoryName}>
              <SubTitle margin={0} padding={[10, 0, 0]}>
                {categoryName}
              </SubTitle>
              <Unpad>
                <Carousel
                  items={category.items}
                  offset={category.offset}
                  cardProps={{
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
