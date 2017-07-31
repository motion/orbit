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
        data: 'google-docs',
        type: 'setup',
        icon: 'google',
      },
      {
        title: 'Setup Google Drive',
        data: 'google-drive',
        type: 'setup',
        icon: 'disk',
      },
      {
        title: 'Setup Dropbox Paper',
        data: 'dropbox-paper',
        type: 'setup',
        icon: 'dropbox',
      },
      {
        title: 'Setup Trello',
        data: 'trello',
        type: 'setup',
        icon: 'trello',
      },
      {
        title: 'Setup Jira',
        data: 'jira',
        type: 'setup',
        icon: 'jira',
      },
      {
        title: 'Setup Github',
        data: 'github',
        type: 'setup',
        icon: 'github',
      },
    ]
  }

  get browse() {
    return [
      {
        title: 'Notifications',
        type: 'notifications',
      },
      { title: 'Home', type: 'browse' },
      { title: 'Team', type: 'feed' },
    ]
  }

  get results() {
    if (!User.loggedIn) {
      return [{ title: 'Login', type: 'pane', pane: 'Login' }]
    }

    // if (User.integrations && User.integrations.length === 0) {
    //   return this.integrations
    // }

    const { children, searchResults, integrations, browse } = this
    const hayStack = [
      ...browse,
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
            .where('home')
            .neq(true)
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
