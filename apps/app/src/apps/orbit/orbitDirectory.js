import * as React from 'react'
import { view, react } from '@mcro/black'
// import * as UI from '@mcro/ui'
import { Person } from '@mcro/models'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'
import { SubTitle } from '~/views'

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
    log('DIRECTORY --------')
    return (
      <OrbitDockedPane name="directory">
        <SubTitle>Lists</SubTitle>
        <Masonry>
          <OrbitCard
            pane="home-directory"
            subPane="directory"
            style={{
              gridColumnEnd: 'span 2',
            }}
            total={10}
            title="Onboarding"
          />
          <OrbitCard
            pane="home-directory"
            subPane="directory"
            style={{
              gridColumnEnd: 'span 2',
            }}
            total={10}
            title="Dev: Getting started"
          />
          <OrbitCard
            pane="home-directory"
            subPane="directory"
            style={{
              gridColumnEnd: 'span 2',
            }}
            total={10}
            title="Success: links"
          />
        </Masonry>

        <br />
        <br />

        <SubTitle>People</SubTitle>
        <Masonry>
          {store.results.map((bit, index) => (
            <OrbitCard
              pane="home-directory"
              subPane="directory"
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
