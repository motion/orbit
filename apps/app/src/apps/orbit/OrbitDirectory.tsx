import * as React from 'react'
import { view, react } from '@mcro/black'
import { modelQueryReaction, compose } from '@mcro/helpers'
import { Person } from '@mcro/models'
import { SubPane } from './SubPane'
import { OrbitCard } from '../../views/OrbitCard'
import { Masonry } from '../../views/Masonry'
import { SubTitle } from '../../views'
import * as Helpers from '../../helpers'
// import { stateOnlyWhenActive } from '../../stores/helpers/stateOnlyWhenActive'
import { PaneManagerStore } from './PaneManagerStore'
import { SearchStore } from '../../stores/SearchStore'

class OrbitDirectoryStore {
  props: {
    paneStore: PaneManagerStore
    searchStore: SearchStore
  }

  setGetResults = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      const getResults = () => this.results
      getResults.shouldFilter = true
      this.props.searchStore.setGetResults(getResults)
    },
    { immediate: true },
  )

  get isActive() {
    return this.props.paneStore.activePane === this.props.name
  }

  get peopleQuery() {
    const query = App.state.query
    if (!query) {
      return ''
    }
    const prefix = query[0] === '@'
    return query.slice(prefix ? 1 : 0)
  }

  get people() {
    return Helpers.fuzzy(this.peopleQuery, this.results, {
      key: 'name',
    })
  }

  // poll every few seconds while active
  results = modelQueryReaction(
    () => Person.find({ take: 100, where: { integration: 'slack' } }),
    {
      defaultValue: [],
    },
  )
}

type Props = {
  store?: OrbitDirectoryStore
  name: string
  paneStore: PaneManagerStore
}

const decorator = compose(
  view.attach('searchStore'),
  view.attach({
    store: OrbitDirectoryStore,
  }),
)

export const OrbitDirectory = decorator((props: Props) => {
  return (
    <SubPane name="directory" fadeBottom>
      <SubTitle>People</SubTitle>
      <OrbitDirectoryInner {...props} />
    </SubPane>
  )
})

const OrbitDirectoryInner = view(({ store }: Props) => {
  const total = store.results.length
  if (!total) {
    return null
  }
  console.log('RENDER PRECIOUS STUFF')
  return (
    <Masonry>
      {store.people.map((bit, index) => (
        <OrbitCard
          pane="docked"
          subPane="directory"
          key={bit.id}
          index={index}
          bit={bit}
          total={total}
          hide={{
            icon: true,
          }}
        />
      ))}
    </Masonry>
  )
})
