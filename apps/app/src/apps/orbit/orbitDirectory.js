import * as React from 'react'
import { view, react } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { App } from '@mcro/stores'
import { Person } from '@mcro/models'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'
import { SubTitle } from '~/views'
import * as Helpers from '~/helpers'

class OrbitDirectoryStore {
  setGetResults = react(
    () => [this.props.paneStore.activePane === this.props.name, this.results],
    ([isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      const getResults = () => this.results
      getResults.shouldFilter = true
      this.props.appStore.setGetResults(getResults)
    },
    { immediate: true },
  )

  // poll every 2 seconds while active
  results = modelQueryReaction(() => Person.find({ take: 10 }), {
    defaultValue: [],
  })
}

@view({
  store: OrbitDirectoryStore,
})
export class OrbitDirectory extends React.Component {
  render({ store }) {
    log('DIRECTORY --------')
    const people = Helpers.fuzzy(App.state.query.slice(1), store.results, {
      key: 'name',
    })
    const total = store.results.length
    return (
      <OrbitDockedPane name="directory" fadeBottom>
        <React.Fragment if={people.length}>
          <SubTitle>People</SubTitle>
          <Masonry>
            {people.map((bit, index) => (
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
      </OrbitDockedPane>
    )
  }

  static style = {
    carousel: {
      flexFlow: 'row',
    },
  }
}
