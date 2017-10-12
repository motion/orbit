// @flow
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import type { PaneProps, PaneResult } from '~/types'
import { Thing } from '~/app'
import { fuzzy } from '~/helpers'
import { OS } from '~/helpers'
import parser from './parser'

function thingToResult(thing: Thing): PaneResult {
  return {
    id: thing.id || thing.data.id,
    title: thing.title,
    type: thing.type,
    iconAfter: true,
    icon: (
      <img
        src={`/images/${thing.integration}-icon-light.svg`}
        style={{ opacity: 0.5, width: 20 }}
      />
    ),
    data: {
      id: thing.id,
      integration: thing.integration,
      type: thing.type,
      body: thing.body,
    },
    category: 'Recently',
  }
}

export default class MainSidebarStore {
  props: PaneProps
  list = null

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
  topThingsRaw: ?Array<Thing> = (() =>
    Thing.find()
      .sort({ updated: 'desc' })
      .limit(3000): any)

  get topThings() {
    return this.topThingsRaw || []
  }

  get search() {
    return this.props.homeStore.search
  }

  get parserResult() {
    return this.search ? parser(this.search) : null
  }

  get things(): Array<PaneResult> {
    return fuzzy(this.topThings || [], this.search)
      .slice(0, this.search.length ? 100 : 8)
      .map(thingToResult)
  }

  pinned: Array<PaneResult> = [
    {
      title: 'GSD',
      type: 'feed',
      icon: (
        <icon style={{ flexFlow: 'row', marginRight: 10 }}>
          {['steph.jpg', 'nick.jpg', 'me.jpg'].map((path, index) => (
            <img
              key={index}
              style={{
                borderRadius: 12,
                width: 20,
                height: 20,
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
        team: 'Product',
        people: ['Carol Hienz', 'Nate Wienert', 'Steel', 'Nick Cammarata'],
      },
    },
  ]

  top: Array<PaneResult> = [
    {
      data: { message: 'my team' },
      title: 'Product',
      category: 'Teams',
      type: 'message',
      icon: 'pin',
    },
    {
      data: { message: 'from company' },
      title: 'Search',
      category: 'Teams',
      type: 'message',
    },
    {
      data: { message: 'from company' },
      title: <UI.Text opacity={0.5}>25 more</UI.Text>,
      category: 'Teams',
      type: 'message',
    },

    {
      data: { message: 'my team' },
      title: 'Foxwoods',
      category: 'Projects',
      type: 'message',
    },
    {
      data: { message: 'from company' },
      title: '16: Fiber',
      category: 'Projects',
      type: 'message',
    },
    {
      data: { message: 'from company' },
      title: <UI.Text opacity={0.5}>200 more</UI.Text>,
      category: 'Projects',
      type: 'message',
    },
  ]

  extras = [
    {
      title: 'Settings',
      icon: 'gear',
      type: 'message',
      data: {
        message: 'Open Settings',
        icon: 'gear',
      },
      onSelect: () => {
        OS.send('open-settings')
      },
      category: 'Settings',
    },
  ]

  get results(): Array<PaneResult> {
    const all = [...this.pinned, ...this.top, ...this.things, ...this.extras]
    const search = fuzzy(all, this.search)
    return search
  }

  select = (index: number) => {
    this.props.navigate(this.results[index])
  }
}
