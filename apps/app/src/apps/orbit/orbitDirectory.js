import * as React from 'react'
import { view, react } from '@mcro/black'
// import * as UI from '@mcro/ui'
import { Person } from '@mcro/models'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'

class OrbitDirectoryStore {
  setGetResults = react(
    () => this.props.paneStore.activePane === this.props.name,
    isActive => {
      if (!isActive) throw react.cancel
      this.props.appStore.setGetResults(() => this.results)
    },
    { immediate: true },
  )

  results = react(
    async () => {
      return await Person.find({ take: 10 })
    },
    { defaultValue: [] },
  )
}

@view({
  store: OrbitDirectoryStore,
})
export class OrbitDirectory {
  render({ store }) {
    log(`DIRECTORY --------`)
    return (
      <OrbitDockedPane name="directory">
        <Masonry>
          {store.results.map((bit, index) => (
            <OrbitCard
              pane="home-directory"
              key={`${bit.id}${index}`}
              index={index}
              bit={bit}
              total={store.results.length}
              hoverToSelect
            />
          ))}
        </Masonry>
      </OrbitDockedPane>
    )
  }
}
