// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import fuzzy from 'fuzzy'
import { User, Document } from '~/app'
import { uniq } from 'lodash'

class BarMainStore {
  searchResults: Array<Document> = []
  @watch children = () => this.root && this.root.getChildren()

  get root() {
    return User.home
  }

  get integrations() {
    return [
      {
        title: 'Setup Google Docs',
        pane: 'Setup',
        data: 'google-docs',
        type: 'pane',
        icon: 'google',
      },
      {
        title: 'Setup Google Drive',
        pane: 'Setup',
        data: 'google-drive',
        type: 'pane',
        icon: 'disk',
      },
      {
        title: 'Setup Dropbox Paper',
        pane: 'Setup',
        data: 'dropbox-paper',
        type: 'pane',
        icon: 'dropbox',
      },
      {
        title: 'Setup Trello',
        pane: 'Setup',
        data: 'trello',
        type: 'pane',
        icon: 'trello',
      },
      {
        title: 'Setup Jira',
        pane: 'Setup',
        data: 'jira',
        type: 'pane',
        icon: 'jira',
      },
      {
        title: 'Setup Github',
        pane: 'Setup',
        data: 'github',
        type: 'pane',
        icon: 'github',
      },
    ]
  }

  get results() {
    if (!User.loggedIn) {
      return [{ title: 'Login', type: 'pane', pane: 'Login' }]
    }

    // if (User.integrations && User.integrations.length === 0) {
    //   return this.integrations
    // }

    const { children, searchResults, integrations } = this
    const hayStack = [
      { title: 'Notifications', type: 'pane', pane: 'Notifications' },
      ...(children || []),
      ...(searchResults || []),
      ...integrations,
    ]
    return fuzzy
      .filter(this.props.search, hayStack, {
        extract: el => el.title,
        pre: '<',
        post: '>',
      })
      .map(item => item.original)
      .filter(x => !!x)
  }

  start() {
    this.props.getRef && this.props.getRef(this)

    this.watch(async () => {
      if (!this.isTypingPath) {
        // search
        const [searchResults, pathSearchResults] = await Promise.all([
          Document.search(this.props.search).exec(),
          Document.collection
            .find()
            .where('slug')
            .regex(new RegExp(`^${this.props.search}`, 'i'))
            .limit(20)
            .exec(),
        ])

        this.searchResults = uniq(
          [...(searchResults || []), ...pathSearchResults],
          x => x.id
        )
      }
    })
  }

  get length() {
    return (this.results && this.results.length) || 0
  }

  select = index => {
    this.props.navigate(this.results[index])
  }
}

@view({
  store: BarMainStore,
})
export default class BarMain {
  render({ store, isActive, highlightIndex, itemProps }) {
    return (
      <UI.List
        if={store.results}
        controlled={isActive}
        isSelected={(item, index) => index === highlightIndex}
        itemProps={itemProps}
        items={store.results}
        getItem={result =>
          <UI.ListItem
            key={result.id}
            icon={result.icon}
            primary={result.title}
          />}
      />
    )
  }
}
