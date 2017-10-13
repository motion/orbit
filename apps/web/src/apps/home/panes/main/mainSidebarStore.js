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
      .limit(3)

  @watch
  myrecent = () =>
    Thing.find()
      .where('author')
      .in(['natew'])
      .sort({ updated: 'desc' })
      .limit(5)

  @watch
  teamrecent = () =>
    Thing.find()
      .where('author')
      .ne('natew')
      .sort({ updated: 'desc' })
      .limit(5)

  get recently() {
    const chop = 3

    let moreMine = []
    let moreTheirs = []
    const mine = this.myrecent || []
    const theirs = this.teamrecent || []

    if (mine.length > chop) {
      moreMine = [
        {
          title: (
            <UI.Title opacity={0.5}>{mine.length - chop} more...</UI.Title>
          ),
          type: 'main',
        },
      ]
    }
    if (theirs.length > chop) {
      moreTheirs = [
        {
          title: (
            <UI.Title opacity={0.5}>{theirs.length - chop} more...</UI.Title>
          ),
          type: 'main',
        },
      ]
    }

    return [
      ...mine
        .slice(0, chop)
        .map(x => Thing.toResult(x, { category: 'My Recent' })),
      ...moreMine,
      ...theirs
        .slice(0, chop)
        .map(x => Thing.toResult(x, { category: 'Team Recent' })),
      ...moreTheirs,
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
      icon: 'fox',
      data: {
        people: ['Carol Hienz', 'Nate Wienert', 'Steel', 'Nick Cammarata'],
      },
    },
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
