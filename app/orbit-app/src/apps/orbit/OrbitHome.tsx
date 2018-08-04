import * as React from 'react'
import { view, react, attachTheme } from '@mcro/black'
import { BitRepository, PersonRepository } from '../../repositories'
import { OrbitCard } from '../../views/OrbitCard'
import { Masonry } from '../../views/Masonry'
import { SubPane } from './SubPane'
import { PaneManagerStore } from './PaneManagerStore'
import { SearchStore } from '../../stores/SearchStore'

type Props = {
  name: string
  paneStore: PaneManagerStore
  searchStore?: SearchStore
  store?: OrbitHomeStore
}

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
    return this.props.paneStore.activePane === this.props.name
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

  results = react(
    async () => {
      const result = await Promise.all([
        // { type: 'team', title: 'Engineering' },
        findType('slack', 'conversation', 2),
        findType('github', 'task', 1),
        findType('slack', 'conversation', 4),
        findType('gdocs', 'document'),
        PersonRepository.findOne({ name: 'Andrew Hsu' }),
        PersonRepository.findOne({ name: 'Nick Bovee' }),
        // limit due to slowness for now
        findType('confluence', 'document'),
        findType('jira', 'document'),
        findType('gmail', 'mail'),
        // findType('gmail', 'mail', 1),
        // findType('gdocs', 'document', 9),
        // findType('slack', 'conversation', 5),
        // findType('slack', 'conversation', 6),
        // findType('slack', 'conversation', 7),
        // findType('slack', 'conversation', 8),
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

@attachTheme
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
    console.log('home results', store.results)
    const total = store.results.length
    return (
      <SubPane name="home" fadeBottom>
        <div style={{ paddingTop: 3 }}>
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
          </Masonry>
        </div>
      </SubPane>
    )
  }
}
