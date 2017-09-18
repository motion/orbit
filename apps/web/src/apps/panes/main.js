// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Thing } from '~/app'
import { fuzzy } from '~/helpers'
import { OS } from '~/helpers'
import * as Pane from './pane'
import TestIssue from './test_data/issue'

import type { PaneProps, PaneResult } from '~/types'

const thingToResult = (thing: Thing): PaneResult => ({
  id: thing.id || thing.data.id,
  title: thing.title,
  type: thing.type,
  icon: 'icon',
  data: thing.toJSON(),
  category: 'Recently',
})

class BarMainStore {
  props: PaneProps

  @watch
  topThingsRaw: ?Array<Thing> = () =>
    Thing.find()
      .sort({ updated: 'desc' })
      .limit(3000)

  get topThings() {
    return this.topThingsRaw || []
  }

  get search() {
    return this.props.barStore.search
  }

  get things(): Array<PaneResult> {
    return fuzzy(this.topThings || [], this.search)
      .slice(0, this.search.length ? 200 : 8)
      .map(thingToResult)
  }

  browse: Array<PaneResult> = [
    {
      id: 1100,
      title: 'Me',
      type: 'team',
      icon: 'radio',
      data: {
        special: true,
        person: 'Nate Wienert',
        image: 'me',
      },
      actions: ['respond to recent'],
    },
    {
      id: 1300,
      data: { message: 'my team' },
      title: 'Github',
      category: 'Apps',
      type: 'message',
      icon: 'github',
    },
    {
      id: 1400,
      data: { message: 'from company' },
      title: 'Jira',
      category: 'Apps',
      type: 'message',
      icon: 'atlas',
    },
  ]

  teams: Array<PaneResult> = [
    {
      id: 1030,
      title: 'Motion',
      type: 'team',
      category: 'Teams',
      data: {
        team: 'Motion',
      },
      actions: ['like motion'],
    },
    {
      id: 1040,
      title: 'Product',
      type: 'team',
      category: 'Teams',
      data: {
        team: 'Product',
      },
      actions: ['like motion'],
    },
    {
      id: 1050,
      title: 'Search',
      type: 'team',
      category: 'Teams',
      data: {
        team: 'Search',
      },
      actions: ['like motion'],
    },
  ]

  people: Array<PaneResult> = [
    {
      id: 20,
      title: 'Stephanie',
      type: 'person',
      data: { person: 'Stephanie He', image: 'steph' },
      category: 'People',
    },
    {
      id: 21,
      title: 'Nate',
      type: 'person',
      data: { person: 'Nate Wienert', image: 'me' },
      category: 'People',
    },
    {
      id: 22,
      title: 'Nick',
      type: 'person',
      data: { person: 'Nick Cammarata', image: 'nick' },
      category: 'People',
    },
  ]

  tests: Array<PaneResult> = [
    {
      id: 500,
      title: ':Github issue about performance',
      type: 'task',
      data: TestIssue,
      category: 'Tests',
    },
    {
      id: 501,
      title: `:Nick's Calendar`,
      type: 'calendar',
      data: {},
      category: 'Calendar',
    },
  ]

  extras = [
    {
      id: 30,
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
    if (!CurrentUser.loggedIn) {
      return [{ title: 'Login', type: 'login', static: true }]
    }
    const includeTests = this.search.indexOf(':') === 0
    const all = [
      ...this.browse,
      ...this.teams,
      ...this.people,
      ...this.things,
      ...(includeTests ? this.tests : []),
      ...this.extras,
    ]

    const getRowHeight = item => {
      const height = this.hasContent(item)
        ? 100
        : item.data && item.data.updated ? 58 : 38
      return { ...item, height }
    }

    return fuzzy(all, this.search).map(getRowHeight)
  }

  hasContent = (result: PaneResult) => result && result.data && result.data.body

  select = (index: number) => {
    this.props.navigate(this.results[index])
  }
}

type Props = {
  mainStore: BarMainStore,
  paneStore: Class<any>,
}

@view.attach('barStore')
@view({
  mainStore: BarMainStore,
})
export default class BarMain extends React.Component<Props> {
  getDate = (result: PaneResult) =>
    result.data && result.data.updated
      ? UI.Date.format(result.data.updated)
      : ''

  render({ mainStore, paneStore }: PaneProps & { mainStore: BarMainStore }) {
    if (!mainStore.results) {
      return null
    }
    return (
      <Pane.Card
        items={mainStore.results}
        width={315}
        groupKey="category"
        itemProps={{
          fontSize: 26,
          size: 1.2,
        }}
        getItem={(result, index) => ({
          key: result.id,
          highlight: () => index === paneStore.activeIndex,
          primary: result.title,
          primaryEllipse: !mainStore.hasContent(result),
          children: [
            <UI.Text if={result.data} lineHeight={20} opacity={0.5}>
              {this.getDate(result) + ' · '}
              {(result.data.body && result.data.body.slice(0, 120)) || ''}
            </UI.Text>,
            <UI.Text if={!result.data}>{this.getDate(result)}</UI.Text>,
          ].filter(Boolean),
          iconAfter: true,
          iconProps: {
            style: {
              alignSelf: 'flex-start',
              paddingTop: 2,
            },
          },
          icon:
            result.data && result.data.image ? (
              <img $image src={`/images/${result.data.image}.jpg`} />
            ) : (
              result.icon
            ),
        })}
      />
    )
  }

  static style = {
    image: {
      width: 20,
      height: 20,
      borderRadius: 1000,
      margin: 'auto',
    },
  }
}
