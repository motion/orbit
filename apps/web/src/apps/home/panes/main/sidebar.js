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
          key === 'left' ||
          key === 'right'
        ) {
          return
        }
        this.setTimeout(() => {
          this.list.scrollToRow(0)
        }, 20)
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

  get things() {
    if (this.search) {
      return fuzzy(this.searchable || [], this.search)
        .slice(0, 30)
        .map(x => Thing.toResult(x, { category: 'Search Results' }))
    }
    return [
      ...(this.myrecent || []).map(x =>
        Thing.toResult(x, { category: 'Recently', itemProps: { children: '' } })
      ),
      ...(this.myrecent || []).map(x =>
        Thing.toResult(x, { category: 'Assigned' })
      ),
    ]
  }

  pinned: Array<PaneResult> = [
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
        people: ['Carol Hienz', 'Nate Wienert', 'Steel', 'Nick Cammarata'],
      },
    },
    // {
    //   title: 'My Team',
    //   displayTitle: <UI.Title size={1.5}>My Team</UI.Title>,
    //   type: 'feed',
    //   icon: 'social-slack',
    //   data: {
    //     people: ['Carol Hienz', 'Nate Wienert', 'Steel', 'Nick Cammarata'],
    //   },
    // },
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
      ...(this.people || []).map(x =>
        Person.toResult(x, { category: 'People' })
      ),
      ...this.settings,
    ]
    const search = fuzzy(all, this.search)
    return search
  }

  select = (index: number) => {
    this.props.navigate(this.results[index])
  }
}
