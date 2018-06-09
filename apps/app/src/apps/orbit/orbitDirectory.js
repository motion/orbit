import * as React from 'react'
import { view, react } from '@mcro/black'
import { Person } from '@mcro/models'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'
import { SubTitle } from '~/views'
import { OrbitCardTeam } from './orbitCardTeam'
import * as _ from 'lodash'
// import { Carousel } from '~/components/carousel'

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
      return [
        {
          title: 'Engineering',
          type: 'team',
          data: {
            people: '19',
            topics: 'Cosal, pTSNE, memorial, left',
            recently: [
              { title: 'Stores, hmr', type: 'github' },
              { title: 'Foxwoods Sprint', type: 'gdocs' },
              { title: 'ux checkout #pp', type: 'slack' },
            ],
          },
        },
        {
          title: 'Design',
          type: 'team',
          data: {
            people: '5',
            topics: 'Checkout, sketch, interaction, fix',
            recently: [
              { title: '360 stage design', type: 'gdocs' },
              { title: 'Kit v2', type: 'github' },
              { title: 'checkout, bug', type: 'slack' },
            ],
          },
        },
        {
          title: 'Marketing',
          type: 'team',
          data: {
            people: '12',
          },
        },
        {
          title: 'Buyers',
          type: 'team',
          data: {
            people: '15',
          },
        },
        {
          title: 'Sales',
          type: 'team',
          data: {
            people: '5',
          },
        },
        ...(await Person.find({ take: 10 })),
      ]
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
    const [teams, people] = _.partition(store.results, x => x.type === 'team')
    const total = store.results.length
    return (
      <OrbitDockedPane name="directory">
        <SubTitle>Teams</SubTitle>
        <React.Fragment if={teams.length}>
          <OrbitCardTeam
            pane="summary"
            subPane="directory"
            index={0}
            total={total}
            store={store}
            bit={teams[0]}
            expanded
            hoverToSelect
          />
          <carousel css={{ margin: [12, 0, 0] }}>
            {teams.slice(1).map((team, index) => (
              <OrbitCardTeam
                key={index}
                pane="summary"
                subPane="directory"
                index={index + 1}
                total={total}
                store={store}
                bit={team}
                hoverToSelect
                css={{
                  width: 140,
                  marginRight: 12,
                }}
              />
            ))}
          </carousel>
        </React.Fragment>
        <br />
        <br />
        <React.Fragment if={people.length}>
          <SubTitle>People</SubTitle>
          <Masonry>
            {people.map((bit, index) => (
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
