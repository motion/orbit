import * as React from 'react'
import { view, react } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Person } from '@mcro/models'
import { OrbitDockedPane } from './OrbitDockedPane'
import { OrbitCard } from './OrbitCard'
import { Masonry } from '../../views/Masonry'
import { SubTitle } from '../../views'
import * as Helpers from '../../helpers'
import { stateOnlyWhenActive } from '../../stores/helpers/stateOnlyWhenActive'

class OrbitDirectoryStore {
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

  state = stateOnlyWhenActive(this)

  get isActive() {
    return this.props.paneStore.activePane === this.props.name
  }

  get peopleQuery() {
    if (!this.state.query) {
      return ''
    }
    const prefix = this.state.query[0] === '@'
    return this.state.query.slice(prefix ? 1 : 0)
  }

  get people() {
    return Helpers.fuzzy(this.peopleQuery, this.results, {
      key: 'name',
    })
  }

  // poll every 2 seconds while active
  results = modelQueryReaction(() => Person.find({ take: 100 }), {
    defaultValue: [],
  })
}

@view.attach('searchStore')
@view.attach({
  store: OrbitDirectoryStore,
})
@view
export class OrbitDirectory extends React.Component<{
  store: OrbitDirectoryStore
}> {
  render() {
    const { store } = this.props
    log('DIRECTORY --------')
    const total = store.results.length
    return (
      <OrbitDockedPane name="directory" fadeBottom>
        {store.people.length ? (
          <React.Fragment>
            <SubTitle>People</SubTitle>
            <Masonry>
              {store.people.map((bit, index) => (
                <OrbitCard
                  pane="summary"
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
          </React.Fragment>
        ) : null}
      </OrbitDockedPane>
    )
  }
}
