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

const MAIN_WIDTH = 260

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

  colIndex = 0

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
      .slice(0, this.search.length ? 100 : 8)
      .map(thingToResult)
  }

  pinned: Array<PaneResult> = [
    {
      title: 'Home',
      icon: 'home',
      type: 'home',
      data: {},
    },
    {
      title: 'Me',
      icon: 'usersingle',
      type: 'feed',
      data: {
        team: 'Product',
        people: ['Nate Wienert'],
      },
    },
  ]

  top: Array<PaneResult> = [
    {
      data: { message: 'my team' },
      title: 'Product',
      category: 'Teams',
      type: 'message',
      icon: 'objbowl',
    },
    {
      data: { message: 'from company' },
      title: 'Search',
      category: 'Teams',
      type: 'message',
      icon: 'objbowl',
    },
    {
      data: { message: 'from company' },
      title: <UI.Text opacity={0.5}>25 more</UI.Text>,
      onClick: () => {
        this.colIndex = 1
      },
      category: 'Teams',
      type: 'message',
      icon: 'objbowl',
    },

    {
      data: { message: 'my team' },
      title: 'Foxwoods',
      category: 'Projects',
      type: 'message',
      icon: 'objspace',
    },
    {
      data: { message: 'from company' },
      title: '16: Fiber',
      category: 'Projects',
      type: 'message',
      icon: 'objspace',
    },
    {
      data: { message: 'from company' },
      title: <UI.Text opacity={0.5}>200 more</UI.Text>,
      category: 'Projects',
      type: 'message',
      icon: 'objspace',
    },

    {
      data: { message: 'my team', image: 'steph.jpg' },
      title: 'Stephanie He',
      category: 'People',
      type: 'message',
    },
    {
      data: { message: 'my team', image: 'nick.jpg' },
      title: 'Carol Long',
      category: 'People',
      type: 'message',
    },
    {
      data: { message: 'my team', image: 'me.jpg' },
      title: 'Dave Bond',
      category: 'People',
      type: 'message',
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
      title: ':Github issue about performance',
      type: 'task',
      data: TestIssue,
      category: 'Tests',
    },
    {
      title: `:Nick's Calendar`,
      type: 'calendar',
      data: {},
      category: 'Calendar',
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

const getDate = (result: PaneResult) =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

const getItem = ({ paneStore, mainStore }) => (result, index) => ({
  key: `${index}${result.id}`,
  highlight: () => index === paneStore.activeIndex,
  //color: [255, 255, 255, 0.6],
  primary: result.title,
  primaryEllipse: !mainStore.hasContent(result),
  children: [
    result.data &&
      result.data.body && (
        <UI.Text key={0} lineHeight={20} opacity={0.5}>
          {getDate(result) + ' · '}
          {(result.data.body && result.data.body.slice(0, 120)) || ''}
        </UI.Text>
      ),
    !result.data && <UI.Text key={1}>{getDate(result)}</UI.Text>,
  ].filter(Boolean),
  iconAfter: result.iconAfter,
  icon:
    result.data && result.data.image ? (
      <img
        style={{
          width: 20,
          height: 20,
          borderRadius: 1000,
          margin: 'auto',
        }}
        src={`/images/${result.data.image}`}
      />
    ) : (
      result.icon
    ),
})

@view
class PrimaryColumn {
  render({ mainStore }) {
    return (
      <Pane.Card
        primary
        items={mainStore.results}
        width={MAIN_WIDTH}
        groupKey="category"
        itemProps={{
          fontSize: 26,
          size: 1.2,
          glow: true,
          padding: [12, 10],
        }}
        getItem={getItem(this.props)}
      />
    )
  }
}

@view
class SecondaryColumn {
  render({ mainStore }) {
    return (
      <Pane.Card
        primary
        items={[
          {
            data: { message: 'my team' },
            title: 'Product',
            category: 'Teams',
            type: 'message',
            icon: 'objbowl',
          },
          {
            data: { message: 'from company' },
            title: 'Search',
            category: 'Teams',
            type: 'message',
            icon: 'objbowl',
          },
          {
            data: { message: 'from company' },
            title: <UI.Text opacity={0.5}>25 more</UI.Text>,
            onClick: () => {
              mainStore.colIndex = 0
            },
            category: 'Teams',
            type: 'message',
            icon: 'objbowl',
          },
        ]}
        width={MAIN_WIDTH}
        groupKey="category"
        itemProps={{
          fontSize: 26,
          size: 1.2,
          glow: true,
          padding: [12, 10],
        }}
        getItem={getItem(this.props)}
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

type Props = {
  mainStore: BarMainStore,
  paneStore: Class<any>,
}

@view.attach('barStore')
@view({
  mainStore: BarMainStore,
})
export default class BarMain extends React.Component<Props> {
  render({ mainStore, paneStore }: PaneProps & { mainStore: BarMainStore }) {
    if (!mainStore.results) {
      return null
    }

    const { colIndex } = mainStore

    return (
      <main>
        <column $position={[0, colIndex]}>
          <PrimaryColumn mainStore={mainStore} paneStore={paneStore} />
        </column>
        <column $position={[1, colIndex]}>
          <SecondaryColumn mainStore={mainStore} paneStore={paneStore} />
        </column>
      </main>
    )
  }

  static style = {
    main: {
      flex: 1,
      flexFlow: 'row',
      width: MAIN_WIDTH,
    },
    active: {
      //background: 'red',
    },
    column: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transition: 'all ease-in 100ms',
    },
    position: ([curIndex, activeIndex]) => {
      return {
        opacity: curIndex === activeIndex ? 1 : 0,
        transform: {
          x: (curIndex - activeIndex) * MAIN_WIDTH,
        },
      }
    },
  }
}
