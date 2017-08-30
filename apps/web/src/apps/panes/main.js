// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Document, Thing } from '~/app'
import { filterItem } from './helpers'
import { OS } from '~/helpers'
import * as Pane from './pane'

import type { PaneProps, PaneResult } from '~/types'

const thingToResult = (thing: Thing): PaneResult => ({
  title: thing.title,
  type: thing.type,
  icon: 'icon',
  data: thing.data,
  category: 'Thing',
})

class BarMainStore {
  props: PaneProps
  filter = (x, opts) => filterItem(x || [], this.props.search, opts)
  topThings = Thing.find({ sort: 'createdAt' })

  start() {
    console.log('this is', this, this.props)
    this.props.getRef(this)
  }

  get things(): Array<PaneResult> {
    console.time('get things()')
    if (!this.topThings) {
      return []
    }
    const filtered = this.filter(this.topThings.map(thingToResult), { max: 8 })
    console.timeEnd('get things()')
    return filtered
  }

  get browse(): Array<PaneResult> {
    return this.filter([
      {
        title: 'Recent',
        type: 'feed',
        icon: 'radio',
        data: {
          special: true,
        },
      },
      {
        data: { message: 'assigned' },
        title: 'Assigned to me',
        type: 'message',
        icon: 'check',
      },
      {
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
        data: {},
        title: 'Test Page',
        category: 'Browse',
        type: 'test',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: {},
        title: 'Orbit → New GitHub Issue',
        category: 'Browse',
        type: 'newIssue',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: {},
        title: 'Gloss → New GitHub Issue',
        category: 'Browse',
        type: 'newIssue',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: {},
        title: 'Motion → New GitHub Issue',
        category: 'Browse',
        type: 'newIssue',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: { message: 'from company' },
        title: 'Company',
        category: 'Browse',
        type: 'message',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
    ])
  }

  get people(): Array<PaneResult> {
    return this.filter([
      {
        title: 'Stephanie',
        type: 'feed',
        data: {
          image: 'steph',
        },
        category: 'People',
      },
      {
        title: 'Nate',
        type: 'feed',
        data: { image: 'me' },
        category: 'People',
      },
      {
        title: 'Nick',
        type: 'feed',
        data: { image: 'nick' },
        category: 'People',
      },
    ])
  }

  get extras() {
    return this.filter([
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
    ])
  }

  get all(): Array<PaneResult> {
    return [...this.browse, ...this.things, ...this.people, ...this.extras]
  }

  actionsByType = {
    issue: ['archive', 'add label', 'milestone'],
  }

  getActions = ({ type }) => {
    return this.actionsByType[type] || []
  }

  get results(): Array<PaneResult> {
    if (!CurrentUser.loggedIn) {
      return [{ title: 'Login', type: 'login', static: true }]
    }
    return this.all
  }

  select = (index: number) => {
    this.props.navigate(this.results[index])
  }
}

@view.provide({ paneStore: Pane.Store })
@view({
  store: BarMainStore,
})
export default class BarMain {
  lastSearch = ''

  componentWillReceiveProps({ isActive, search }) {
    if (this.lastSearch !== search) {
      this.props.store.search()
      this.lastSearch = this.props.search
    }

    this.props.paneStore.isActive = isActive
  }

  render({ store, isActive, activeRow, paneProps, onSelect }: PaneProps & {| store: BarMainStore |}) {
  const secondary = item => {
    if (item.data && item.data.service === 'github')
      return (
        <secondary>
          <spread $$row>
            <left>
              {item.data.comments.length} replies
              </left>
            <right>
              {item.data.labels}
            </right>
          </spread>
        </secondary>
      )

    return null
  }

  return (
    <Pane.Card isActive={isActive} width={340} $pane>
      <UI.List
        if={store.results}
        selected={activeRow}
        onSelect={(item, index) => {
          onSelect(index)
        }}
        itemProps={paneProps.itemProps}
        groupKey="category"
        items={store.results}
        getItem={(result, index) =>
          <Pane.Selectable
            key={index}
            options={{
              when: '3 days ago',
              name: result.title,
              actions: store.getActions(result),
              id: result.title,
              body: null, //<h2>hello</h2>,
              index,
            }}
          />}
      />
    </Pane.Card>
  )
}

static style = {
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
