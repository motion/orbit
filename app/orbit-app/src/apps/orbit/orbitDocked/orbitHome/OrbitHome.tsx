import * as React from 'react'
import { view, react } from '@mcro/black'
import { BitRepository } from '../../../../repositories'
import { SubTitle } from '../../../../views'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../../../../stores/SelectionStore'
import { Carousel } from '../../../../components/Carousel'
import { capitalize } from 'lodash'
import { View } from '@mcro/ui'

type Props = {
  name: string
  paneManagerStore: PaneManagerStore
  selectionStore?: SelectionStore
  store?: OrbitHomeStore
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

  setGetResults = react(
    () => [this.isActive, this.results],
    async ([isActive], { sleep }) => {
      if (!isActive) throw react.cancel
      sleep()
      this.props.selectionStore.setGetResult(index => this.results[index])
    },
  )

  get results() {
    let res = []
    for (const key in this.following) {
      res = [...res, ...this.following[key].items]
    }
    return res
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

@view.attach('searchStore')
@view.attach({
  store: OrbitHomeStore,
})
@view
export class OrbitHome extends React.Component<Props> {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  render() {
    const { store } = this.props
    return (
      <SubPane name="home" fadeBottom>
        <div style={{ paddingTop: 3 }}>
          {Object.keys(store.following).map(categoryName => {
            const category = store.following[categoryName]
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
          <View height={20} />
        </div>
      </SubPane>
    )
  }
}
