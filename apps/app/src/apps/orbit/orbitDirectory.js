import * as React from 'react'
import { view, react } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Person } from '@mcro/models'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'
import { SubTitle } from '~/views'
import { OrbitCardTeam } from './orbitCardTeam'
import * as _ from 'lodash'
// import { Carousel } from '~/components/carousel'

// {
//   title: 'Engineering',
//   type: 'team',
//   data: {
//     people: '19',
//     topics: 'Cosal, pTSNE, memorial, left',
//     recently: [
//       { title: 'Stores, hmr', type: 'github' },
//       { title: 'Foxwoods Sprint', type: 'gdocs' },
//       { title: 'ux checkout #pp', type: 'slack' },
//     ],
//   },
// },
// {
//   title: 'Design',
//   type: 'team',
//   data: {
//     people: '5',
//     topics: 'Checkout, sketch, interaction, fix',
//     recently: [
//       { title: '360 stage design', type: 'gdocs' },
//       { title: 'Kit v2', type: 'github' },
//       { title: 'checkout, bug', type: 'slack' },
//     ],
//   },
// },
// {
//   title: 'Marketing',
//   type: 'team',
//   data: {
//     people: '12',
//   },
// },
// {
//   title: 'Buyers',
//   type: 'team',
//   data: {
//     people: '15',
//   },
// },
// {
//   title: 'Sales',
//   type: 'team',
//   data: {
//     people: '5',
//   },
// },

class OrbitDirectoryStore {
  setGetResults = react(
    () => [this.props.paneStore.activePane === this.props.name, this.results],
    ([isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      const getResults = () => this.results
      getResults.shouldFilter = true
      this.props.appStore.setGetResults()
    },
    { immediate: true },
  )

  // poll every 2 seconds while active
  results = modelQueryReaction(() => Person.find({ take: 10 }))
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
        <teams if={false}>
          <SubTitle>Teams</SubTitle>
          <React.Fragment if={teams.length}>
            <OrbitCardTeam
              pane="summary"
              subPane="directory"
              index={0}
              total={total}
              store={store}
              bit={teams[0]}
              isExpanded
              hoverToSelect
            />
            <space css={{ height: 12 }} />
            <OrbitCardTeam
              pane="summary"
              subPane="directory"
              index={1}
              total={total}
              store={store}
              bit={teams[1]}
              isExpanded
              hoverToSelect
            />
            <carousel css={{ margin: [12, 0, 0] }}>
              {teams.slice(2).map((team, index) => (
                <OrbitCardTeam
                  key={index}
                  pane="summary"
                  subPane="directory"
                  index={index + 2}
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
        </teams>
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
