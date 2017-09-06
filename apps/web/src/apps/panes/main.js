// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Thing } from '~/app'
import { fuzzy } from '~/helpers'
import { OS } from '~/helpers'
import * as Pane from './pane'

import type { PaneProps, PaneResult } from '~/types'

const thingToResult = (thing: Thing): PaneResult => ({
  id: thing.id,
  title: thing.title,
  type: thing.type,
  icon: 'icon',
  data: thing.data,
  category: 'Thing',
})

class BarMainStore {
  props: PaneProps
  topThings: ?Array<Thing> = Thing.find({ sort: 'createdAt' })

  start() {
    this.props.getRef(this)
  }

  get things(): Array<PaneResult> {
    return fuzzy(this.topThings || [], this.props.search)
      .slice(0, 8)
      .map(thingToResult)
  }

  browse: Array<PaneResult> = [
    {
      id: 10,
      title: 'Team: Motion',
      type: 'team',
      data: {
        team: 'motion',
      },
    },
    {
      id: 11,
      title: 'Recent',
      type: 'feed',
      icon: 'radio',
      data: {
        special: true,
      },
    },
    {
      id: 12,
      data: { message: 'assigned' },
      title: 'Assigned to me',
      type: 'message',
      icon: 'check',
    },
    {
      id: 13,
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
      id: 14,
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
      [...this.browse, ...this.things, ...this.people, ...this.extras],
      this.props.search
    )
  }

  select = (index: number) => {
    this.props.navigate(this.results[index])
  }
  getActions() {
    return ['one', 'two', 'four']
  }
}

@view.provide({ paneStore: Pane.Store })
@view({
  store: BarMainStore,
})
export default class BarMain extends React.Component<> {
  static defaultProps: {}
  render({
    store,
    isActive,
    highlightIndex,
    activeIndex,
    paneProps,
    onSelect,
  }: PaneProps & { store: BarMainStore }) {
    const secondary = item => {
      if (item.data && item.data.service === 'github')
        return (
          <spread $$row>
            <left>
              {item.data.comments.length} replies
            </left>
            <right>
              {item.data.labels}
            </right>
          </spread>
        )

      return null
    }

    const getHeight = index => 38 // (index === activeRow ? 55 : 38)

    return (
      <Pane.Card isActive={isActive} width={340} $pane>
        <none if={store.results.length === 0}>No Results</none>
        <UI.List
          if={store.results}
          /*
          virtualized={{
            rowHeight: 38, // getHeight,
          }}
          */
          selected={activeIndex}
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
                actions: store.getActions(result),
                id: result.title,
                index,
              }}
              render={(isActive, actions) =>
                <UI.ListItem
                  onClick={() => onSelect(index)}
                  highlight={index === activeIndex}
                  key={result.id}
                  icon={
                    result.data && result.data.image
                      ? <img $image src={`/images/${result.data.image}.jpg`} />
                      : result.icon || (result.doc && result.doc.icon)
                  }
                  primary={result.title}
                  secondary={
                    <container if={false}>
                      {secondary(result)}
                      {actions}
                    </container>
                  }
                />}
            />}
        />
      </Pane.Card>
    )
  }

  static style = {
    pane: {
      width: 340,
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
