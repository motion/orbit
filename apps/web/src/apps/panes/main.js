// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Document, Thing } from '~/app'
import { filterItem } from './helpers'
import { OS } from '~/helpers'
import type { PaneProps, PaneResult } from '~/types'

const thingToResult = (thing: Thing) => ({
  title: thing.title,
  type: thing.type,
  icon: 'icon',
  data: thing.data,
  category: 'Thing',
})

class BarMainStore {
  props: PaneProps

  start() {
    this.props.getRef(this)
  }

  topThings = Thing.find({ sort: 'created_at' })
  @watch searchThings = () => Thing.search(this.props.search)

  // 10 most relevant things
  get things(): Array<PaneResult> {
    if (!this.props.search) {
      return this.topThings.slice(0, 10).map(thingToResult)
    }
    return this.searchThings.slice(0, 10).map(thingToResult)
  }

  get browse(): Array<PaneResult> {
    return [
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
  }

  get people(): Array<PaneResult> {
    return [
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
    ]
  }

  get results(): Array<PaneResult> {
    if (!CurrentUser.loggedIn) {
      return [{ title: 'Login', type: 'login', static: true }]
    }

    const results = filterItem(
      [
        ...this.browse,
        ...this.things,
        ...this.people,
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
      ],
      this.props.search
    )

    if (this.props.search) {
      results.push({
        title: `Search "${this.props.search}"`,
        type: 'feed',
      })
    }

    return results
  }

  select = (index: number) => {
    this.props.navigate(this.results[index])
  }
}

@view({
  store: BarMainStore,
})
export default class BarMain {
  render({
    store,
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
    return (
      <pane>
        <UI.List
          if={store.results}
          selected={activeIndex}
          onSelect={(item, index) => {
            onSelect(index)
          }}
          itemProps={paneProps.itemProps}
          groupKey="category"
          items={store.results}
          getItem={(result, index) =>
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
              secondary={secondary(result)}
            />}
        />
      </pane>
    )
  }

  static style = {
    pane: {
      width: 340,
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
