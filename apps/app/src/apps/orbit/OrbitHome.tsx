import * as React from 'react'
import { view, react, attachTheme } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Bit, Person } from '@mcro/models'
import { OrbitCard } from './OrbitCard'
import { Masonry } from '../../views/Masonry'
import { OrbitDockedPane } from './OrbitDockedPane'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'

const findType = (integration, type, skip = 0) =>
  Bit.findOne({
    skip,
    where: {
      type,
      integration,
    },
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
  })

class OrbitHomeStore {
  setGetResults = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      this.props.searchStore.setGetResults(() => this.results)
    },
    { immediate: true },
  )

  get isActive() {
    return this.props.paneStore.activePane === this.props.name
  }

  results = modelQueryReaction(
    async () => {
      console.time('homeSearch')
      const result = await Promise.all([
        // { type: 'team', title: 'Engineering' },
        findType('slack', 'conversation', 2),
        findType('github', 'task', 1),
        findType('slack', 'conversation', 4),
        findType('gdocs', 'document'),
        Person.findOne({ name: 'Andrew Hsu' }),
        Person.findOne({ name: 'Nick Bovee' }),
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
      console.timeEnd('homeSearch')
      return result.filter(Boolean)
    },
    {
      defaultValue: [],
      poll: 60 * 1000,
    },
  )
}

const selectedTheme = { color: 'rgb(34.3%, 26.9%, 54.2%)', background: '#fff' }
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
export class OrbitHome extends React.Component<{
  name: string
  paneStore: OrbitDockedPaneStore
  store?: OrbitHomeStore
}> {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  render() {
    const { store } = this.props
    log('HOME---------------')
    const total = store.results.length
    return (
      <OrbitDockedPane name="home" fadeBottom>
        <div>
          <Masonry>
            {store.results.map((bit, index) => {
              const isExpanded = index < 2
              return (
                <OrbitCard
                  pane="docked"
                  subPane="home"
                  selectedTheme={selectedTheme}
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
      </OrbitDockedPane>
    )
  }
}
