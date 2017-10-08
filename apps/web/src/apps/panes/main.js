// @flow
import parser from '../bar/parser'
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Thing } from '~/app'
import { fuzzy } from '~/helpers'
import { OS } from '~/helpers'
import * as Pane from '~/apps/pane'
import TestIssue from './task/test_data/issue'
import type { PaneProps, PaneResult } from '~/types'
import { includes } from 'lodash'

const thingToResult = (thing: Thing): PaneResult => ({
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
  data: thing.toJSON(),
  category: 'Recently',
})

class BarMainStore {
  props: PaneProps

  @watch
  topThingsRaw: ?Array<Thing> = (() =>
    Thing.find()
      .sort({ updated: 'desc' })
      .limit(3000): any)

  get topThings() {
    return this.topThingsRaw || []
  }

  get search() {
    return this.props.barStore.search
  }

  get parserResult() {
    return this.search ? parser(this.search) : null
  }

  get searchResult() {
    if (!this.parserResult) {
      return null
    }
    const { people, startDate, endDate, service } = this.parserResult
    const person = people.length > 0 ? people[0] : undefined
    const actuallyFeed = ['docs', 'issues', 'github', 'calendar', 'tasks']
    const type = (includes(actuallyFeed, service) ? 'feed' : service) || 'feed'
    const val = {
      id: `type:${people.join(':')}`,
      title: type,
      type,
      data: {
        startDate,
        endDate,
        type,
        person,
        image: person,
        service,
        people,
      },
      people,
      startDate,
      endDate,
    }
    return val
  }

  get things(): Array<PaneResult> {
    return fuzzy(this.topThings || [], this.search)
      .slice(0, this.search.length ? 200 : 8)
      .map(thingToResult)
  }

  pinned: Array<PaneResult> = [
    {
      id: 1040,
      title: 'Home',
      icon: 'home',
      type: 'home',
      data: {},
    },
    {
      id: 1040,
      title: 'Me',
      icon: 'usersingle',
      type: 'feed',
      data: {
        team: 'Product',
        people: ['Nate'],
      },
    },
  ]

  top: Array<PaneResult> = [
    {
      id: 1300,
      data: { message: 'my team' },
      title: 'Team: Foxwoods',
      category: 'Pinned',
      type: 'message',
      icon: 'social-slack',
    },
    {
      id: 1400,
      data: { message: 'from company' },
      title: 'Orbit Launch',
      category: 'Pinned',
      type: 'message',
      icon: 'social-dropbox',
    },
    {
      id: 1400,
      data: { message: 'from company' },
      title: 'User Research',
      category: 'Pinned',
      type: 'message',
      icon: 'social-trello',
    },

    // {
    //   id: 1300,
    //   title: 'Google Docs',
    //   category: 'Services',
    //   type: 'message',
    //   data: { image: 'google-docs-icon.svg' },
    // },
    // {
    //   id: 1300,
    //   title: 'Github',
    //   category: 'Services',
    //   type: 'message',
    //   data: { image: 'github-icon.svg' },
    // },
    // {
    //   id: 1300,
    //   title: 'Google Drive',
    //   category: 'Services',
    //   type: 'message',
    //   data: { image: 'drive-icon.svg' },
    // },
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
    {
      id: 502,
      title: ':topic',
      type: 'topic',
      category: 'Tests',
    },
    {
      id: 503,
      title: ':stats',
      type: 'stats',
      category: 'Tests',
    },
  ]

  extras = [
    {
      id: 30,
      title: 'services',
      icon: 'orbit',
      type: 'services',
      category: 'Services',
    },
  ]

  get results(): Array<PaneResult> {
    const includeTests = this.search.indexOf(':') === 0
    const all = [
      ...this.pinned,
      ...this.top,
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

    const search = fuzzy(all, this.search).map(getRowHeight)
    if (this.searchResult) return [getRowHeight(this.searchResult), ...search]
    return search
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
        primary
        items={mainStore.results}
        width={270}
        groupKey="category"
        itemProps={{
          fontSize: 26,
          size: 1.2,
          glow: true,
          padding: [12, 10],
        }}
        getItem={(result, index) => ({
          key: `${index}${result.id}`,
          highlight: () => index === paneStore.activeIndex,
          //color: [255, 255, 255, 0.6],
          primary: result.title,
          primaryEllipse: !mainStore.hasContent(result),
          children: [
            <UI.Text
              if={result.data && result.data.body}
              key={0}
              lineHeight={20}
              opacity={0.5}
            >
              {this.getDate(result) + ' · '}
              {(result.data.body && result.data.body.slice(0, 120)) || ''}
            </UI.Text>,
            <UI.Text if={!result.data} key={1}>
              {this.getDate(result)}
            </UI.Text>,
          ].filter(Boolean),
          iconAfter: result.iconAfter,
          iconProps: {
            style: {
              //alignSelf: 'flex-start',
              //paddingTop: 2,
            },
          },
          icon:
            result.data && result.data.image ? (
              <img $image src={`/images/${result.data.image}`} />
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
