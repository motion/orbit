// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Thing } from '~/app'
import { fuzzy } from '~/helpers'
import { OS } from '~/helpers'
import * as Pane from './pane'
import TestIssue from './test_data/issue'

import type { PaneProps, PaneResult } from '~/types'

const thingToResult = (thing: Thing): PaneResult => ({
  id: thing.id,
  title: thing.title,
  type: thing.type,
  icon: 'icon',
  data: thing.toJSON(),
  category: 'Thing',
})

class BarMainStore {
  props: PaneProps
  listRef = null
  topThings: ?Array<Thing> = Thing.find()
    .sort('createdAt')
    .limit(300)

  get search() {
    return this.props.paneStore.search
  }

  start() {
    this.props.getRef(this)

    this.react(
      () =>
        this.results && this.listRef && `${this.search}${this.results.length}`,
      () => {
        this.setTimeout(() => {
          this.listRef.updateChildren()
          this.listRef.measure()
        })
      }
    )

    this.react(
      () => this.props.paneStore.activeIndex,
      row => this.listRef && this.listRef.scrollToRow(row)
    )
  }

  get things(): Array<PaneResult> {
    return fuzzy(this.topThings || [], this.search)
      .slice(0, this.search.length ? 20 : 8)
      .map(thingToResult)
  }

  browse: Array<PaneResult> = [
    {
      id: 1000,
      title: 'Team: Motion',
      type: 'team',
      data: {
        team: 'motion',
      },
      actions: ['like motion'],
    },
    {
      id: 1100,
      title: 'Recent',
      type: 'feed',
      icon: 'radio',
      data: {
        special: true,
      },
      actions: ['respond to recent'],
    },
    {
      id: 1200,
      data: { message: 'assigned' },
      title: 'Assigned to me',
      type: 'message',
      icon: 'check',
    },
    {
      id: 1300,
      data: { message: 'my team' },
      title: 'My Team',
      category: 'Browse',
      type: 'message',
      url() {
        return '/?home=true'
      },
      icon: 'objects_planet',
    },
    {
      id: 1400,
      data: { message: 'from company' },
      title: 'Company',
      category: 'Browse',
      type: 'message',
      url() {
        return '/?home=true'
      },
      icon: 'objects_planet',
    },
  ]

  people: Array<PaneResult> = [
    {
      id: 20,
      title: 'Stephanie',
      type: 'feed',
      data: {
        image: 'steph',
      },
      category: 'People',
    },
    {
      id: 21,
      title: 'Nate',
      type: 'feed',
      data: { person: 'natew', image: 'me' },
      category: 'People',
    },
    {
      id: 22,
      title: 'Nick',
      type: 'feed',
      data: { person: 'ncammarata', image: 'nick' },
      category: 'People',
    },
  ]

  tests: Array<PaneResult> = [
    {
      id: 500,
      title: 'Github issue about performance',
      type: 'task',
      data: TestIssue,
      category: 'Tests',
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
    return fuzzy(
      [
        ...this.browse,
        ...this.tests,
        ...this.things,
        ...this.people,
        ...this.extras,
      ],
      this.search
    )
  }

  select = (index: number) => {
    this.props.navigate(this.results[index])
  }
}

@view({
  mainStore: BarMainStore,
})
export default class BarMain extends React.Component<> {
  static defaultProps: {}

  onSelect = (item, index) => this.props.paneStore.selectRow(index)
  hasContent = result => result && result.data && result.data.body
  getRowHeight = i =>
    this.hasContent(this.props.mainStore.results[i]) ? 100 : 38

  render({ mainStore, paneStore }: PaneProps & { mainStore: BarMainStore }) {
    return (
      <Pane.Card width={315} $pane isActive={paneStore.isActive}>
        <none if={mainStore.results.length === 0}>No Results</none>
        <UI.List
          if={mainStore.results}
          getRef={mainStore.ref('listRef').set}
          virtualized={{
            rowHeight: this.getRowHeight,
          }}
          onSelect={this.onSelect}
          groupKey="category"
          items={mainStore.results}
          itemProps={paneStore.itemProps}
          getItem={(result, index) => ({
            key: result.id,
            highlight: () => index === paneStore.activeIndex,
            primary: result.title,
            date: <UI.Date if={result.data}>{result.data.updatedAt}</UI.Date>,
            children: (
              <UI.Text
                if={result.data && result.data.body}
                css={{ opacity: 0.5 }}
              >
                {result.data.body.slice(0, 120)}
              </UI.Text>
            ),
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
      </Pane.Card>
    )
  }

  static style = {
    pane: {
      height: '100%',
    },
    spread: {
      justifyContent: 'space-between',
    },
    image: {
      width: 20,
      height: 20,
      borderRadius: 1000,
      margin: 'auto',
    },
  }
}
