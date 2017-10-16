// @flow
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import type { PaneProps, PaneResult } from '~/types'
import { Person, Thing } from '~/app'
import { fuzzy } from '~/helpers'

export default class MainSidebarStore {
  props: PaneProps
  list = null

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
    let lastKey = null
    this.react(
      () => this.props.homeStore.lastKey,
      key => {
        if (key !== lastKey) {
          lastKey = key
          this.setTimeout(() => {
            this.list.scrollToRow(0)
          }, 100)
        }
      }
    )
  }

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
      .limit(5000)

  @watch
  teamrecent = () =>
    Thing.find()
      .where('author')
      .ne('natew')
      .sort({ updated: 'desc' })
      .limit(5000)

  get recently() {
    const chop = 3
    const mine = this.myrecent || []
    const theirs = this.teamrecent || []

    return [
      ...mine
        .slice(0, !this.props.homeStore.search ? chop : Number.MAX_VALUE)
        .map(x => Thing.toResult(x, { category: 'My Recent' })),
      ...theirs
        .slice(0, !this.props.homeStore.search ? chop : Number.MAX_VALUE)
        .map(x => Thing.toResult(x, { category: 'Team Recent' })),
    ]
  }

  pinned: Array<PaneResult> = [
    {
      title: 'Orbit',
      displayTitle: <UI.Title size={1.5}>Orbit</UI.Title>,
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
    {
      title: 'Team GSD',
      type: 'feed',
      icon: 'social-slack',
      data: {
        people: ['Carol Hienz', 'Nate Wienert', 'Steel', 'Nick Cammarata'],
      },
    },
  ]

  testing = [
    { title: 'Context', type: 'context', category: 'testing', icon: 'gear' },
  ]

  settings = [
    {
      title: 'Services',
      icon: 'gear',
      type: 'services',
      category: 'Settings',
    },
  ]

  get results(): Array<PaneResult> {
    const all = [
      ...this.pinned,
      ...this.testing,
      ...this.recently,
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
