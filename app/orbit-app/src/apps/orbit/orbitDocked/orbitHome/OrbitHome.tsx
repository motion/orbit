import * as React from 'react'
import { view, react } from '@mcro/black'
import { BitRepository, PersonRepository } from '../../../../repositories'
import { OrbitCard } from '../../../../views/OrbitCard'
import { Masonry } from '../../../../views/Masonry'
import { SubTitle } from '../../../../views'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SearchStore } from '../../../../stores/SearchStore'
import { Carousel } from '../../../../components/Carousel'
import { capitalize } from 'lodash'
import { View } from '@mcro/ui'

type Props = {
  name: string
  paneManagerStore: PaneManagerStore
  searchStore?: SearchStore
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

const findType = (integration, type, skip = 0) =>
  BitRepository.findOne({
    skip,
    where: {
      type,
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
      if (!isActive) {
        throw react.cancel
      }
      await sleep(40)
      this.props.searchStore.setGetResults(() => this.results)
    },
    { immediate: true },
  )

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
          res[capitalize(name)] = all[name]
        }
      }
      return res
    },
    {
      defaultValue: {},
    },
  )

  results = react(
    async () => {
      const result = await Promise.all([
        findType('slack', 'conversation', 2),
        findType('github', 'task', 1),
        findType('slack', 'conversation', 4),
        findType('gdocs', 'document'),
        PersonRepository.findOne({ skip: 5 }),
        PersonRepository.findOne({ skip: 1 }),
        findType('confluence', 'document'),
        findType('jira', 'document'),
        findType('gmail', 'mail'),
        findType('gmail', 'mail', 1),
      ])
      return result.filter(Boolean)
    },
    {
      defaultValue: [],
    },
  )
}

const itemProps = {
  shownLimit: 3,
  contentStyle: {
    maxHeight: '1.2rem',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 18,
    opacity: 0.8,
    margin: [5, 0],
  },
}

const Section = view()

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
    const total = store.results.length
    return (
      <SubPane name="home" fadeBottom>
        <div style={{ paddingTop: 3 }}>
          {Object.keys(store.following).map(category => {
            return (
              <Section key={category}>
                <SubTitle margin={0} padding={[10, 0, 0]}>
                  {category}
                </SubTitle>
                <Carousel
                  items={store.following[category]}
                  cardProps={{
                    padding: 10,
                    hide: { body: true },
                    titleFlex: 1,
                  }}
                />
              </Section>
            )
          })}
          <View height={20} />

          {/* <SubTitle>Interesting</SubTitle>
          <Masonry>
            {store.results.map((bit, index) => {
              const isExpanded = index < 2
              return (
                <OrbitCard
                  pane="docked"
                  subPane="home"
                  key={`${bit.id}${index}`}
                  index={index}
                  bit={bit}
                  total={total}
                  isExpanded={false && isExpanded}
                  style={isExpanded && this.span2}
                  itemProps={itemProps}
                />
              )
            })}
          </Masonry> */}
        </div>
      </SubPane>
    )
  }
}
