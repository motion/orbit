import * as React from 'react'
import { view, react } from '@mcro/black'
import { Person } from '@mcro/models'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'
import { SubTitle } from '~/views'
import { OrbitCardTeam } from './orbitCardTeam'

class OrbitDirectoryStore {
  setGetResults = react(
    () => [this.props.paneStore.activePane === this.props.name, this.results],
    ([isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
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
    const teams = [
      {
        title: 'Engineering',
        people: '19',
        topics: 'Cosal, pTSNE, memorial, left',
        recently: [
          { title: 'Stores, hmr', type: 'github' },
          { title: 'Foxwoods Sprint', type: 'gdocs' },
          { title: 'ux checkout #pp', type: 'slack' },
        ],
      },
      {
        title: 'Design',
        people: '5',
        topics: 'Checkout, sketch, interaction, fix',
        recently: [
          { title: '360 stage design', type: 'gdocs' },
          { title: 'Kit v2', type: 'github' },
          { title: 'checkout, bug', type: 'slack' },
        ],
      },
    ]
    const total = store.results.length + teams.length
    return (
      <OrbitDockedPane name="directory">
        <SubTitle>Teams</SubTitle>
        <items>
          {teams.map((team, index) => (
            <OrbitCardTeam
              key={index}
              pane="summary"
              subPane="directory"
              index={index}
              total={total}
              store={store}
              bit={{ title: team.title, type: 'team' }}
              hoverToSelect
              {...team}
            />
          ))}
        </items>
        <br />
        <br />
        <SubTitle>People</SubTitle>
        <Masonry>
          {store.results.map((bit, index) => (
            <OrbitCard
              pane="summary"
              subPane="directory"
              key={`${bit.id}${index}`}
              index={index + teams.length}
              bit={bit}
              total={total}
              hoverToSelect
            />
          ))}
        </Masonry>
      </OrbitDockedPane>
    )
  }
}
