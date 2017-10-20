// @flow
import * as React from 'react'
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import type { PaneProps, PaneResult } from '~/types'
import { Person, Thing } from '~/app'
import { fuzzy } from '~/helpers'
import { capitalize } from 'lodash'

export default class MainSidebar {
  props: PaneProps
  list = null
  started = false

  willMount() {
    this.setTimeout(() => {
      this.started = true
    }, 200)
  }

  get search() {
    return this.props.homeStore.search
  }

  onListRef(ref) {
    if (!this.list) {
      this.list = ref
      this._watchLastKey()
    }
  }

  _watchLastKey() {
    this.react(
      () => this.props.homeStore.lastKey,
      key => {
        if (
          key === 'up' ||
          key === 'down' ||
          key === 'right' ||
          key === 'left'
        ) {
          return
        }
        this.props.homeStore.stack.last.setActive(0, 0)
      }
    )
  }

  @watch
  searchable = () =>
    this.started &&
    Thing.find()
      .sort({ updated: 'desc' })
      .limit(8000)

  @watch
  people = () =>
    Person.find()
      .sort({ updatedAt: 'desc' })
      .limit(300)

  @watch
  myrecent = () =>
    Thing.find()
      .where('author')
      .in(['natew'])
      .sort({ updated: 'desc' })
      .limit(3)

  @watch
  teamrecent = () =>
    Thing.find()
      .where('author')
      .ne('natew')
      .sort({ updated: 'desc' })
      .limit(3)

  @watch
  lastEvents = () =>
    this.thingIds.length &&
    Event.find()
      .where('thingId')
      .in(this.thingIds)

  get thingToEvent() {
    return (this.lastEvents || []).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.thingId]: cur,
      }),
      {}
    )
  }

  get thingIds() {
    const getIds = x => (x || []).map(x => x.id)
    return [
      ...getIds(this.searchable),
      ...getIds(this.people),
      ...getIds(this.myrecent),
      ...getIds(this.teamrecent),
    ]
  }

  get things() {
    if (this.search) {
      return fuzzy(this.searchable || [], this.search)
        .slice(0, 30)
        .map(x => Thing.toResult(x, { category: 'Search Results' }))
    }
    return [
      ...(this.myrecent || []).map(thing => {
        const event = this.thingToEvent[thing.id]
        return {
          ...Thing.toResult(thing),
          category: 'Recently',
          event,
        }
      }),
      ...(this.teamrecent || []).map(x =>
        Thing.toResult(x, { category: 'My Team' })
      ),
    ]
  }

  pinned: Array<PaneResult> = [
<<<<<<< HEAD
    {
      id: 0,
      title: 'My Team',
      displayTitle: <UI.Title size={1.5}>My Team</UI.Title>,
      type: 'feed',
      icon: (
        <icon style={{ alignSelf: 'center', flexFlow: 'row', marginRight: 10 }}>
          {['steph.jpg', 'nick.jpg', 'me.jpg'].map((path, index) => (
            <img
              key={index}
              style={{
                borderRadius: 12,
                width: 25,
                height: 25,
                marginRight: -10,
                transform: `rotate(${{
                  0: '-15%',
                  1: '0',
                  2: '15%',
                }[index]})`,
              }}
              src={`/images/${path}`}
            />
          ))}
        </icon>
      ),
      data: {
        type: 'person',
        people: ['Carol Hienz', 'Nate Wienert', 'Steel', 'Nick Cammarata'],
      },
    },
    {
      id: 1,
      title: 'babel/babel',
      displayTitle: <UI.Title size={1.5}>Babel</UI.Title>,
      type: 'feed',
      icon: <div />,
      data: {
        type: 'repo',
        repo: 'babel/babel',
      },
    },
=======
    // {
    //   id: 0,
    //   title: 'My Team',
    //   displayTitle: <UI.Title size={1.5}>My Team</UI.Title>,
    //   type: 'feed',
    //   icon: (
    //     <icon style={{ alignSelf: 'center', flexFlow: 'row', marginRight: 10 }}>
    //       {['steph.jpg', 'nick.jpg', 'me.jpg'].map((path, index) => (
    //         <img
    //           key={index}
    //           style={{
    //             borderRadius: 12,
    //             width: 25,
    //             height: 25,
    //             marginRight: -10,
    //             transform: `rotate(${{
    //               0: '-15%',
    //               1: '0',
    //               2: '15%',
    //             }[index]})`,
    //           }}
    //           src={`/images/${path}`}
    //         />
    //       ))}
    //     </icon>
    //   ),
    //   data: {
    //     people: ['Carol Hienz', 'Nate Wienert', 'Steel', 'Nick Cammarata'],
    //   },
    // },
>>>>>>> 365394e2b1413c7f8014c5849284bf70a62ded2f
  ]

  get settings() {
    return ['github', 'google', 'slack'].map(name => ({
      title: capitalize(name),
      icon: `social-${name}`,
      type: 'services',
      category: 'Services',
    }))
  }

  get results(): Array<PaneResult> {
    const all = [
      ...this.pinned,
      ...this.things,
      // ...this.testing,
      ...(this.people || []).map(x =>
        Person.toResult(x, { category: 'People' })
      ),
      ...this.settings,
    ]
    const search = fuzzy(all, this.search)
    if (!search.length) {
      return [
        {
          type: 'message',
          title: 'No Results...',
          data: { message: 'No results' },
          category: 'Search Results',
        },
      ]
    }
    return search
  }

  select = (index: number) => {
    this.props.navigate(this.results[index])
  }
}
