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

  get results() {
    const { children, searchResults } = this
    const hayStack = [
      { title: 'Notifications', type: 'pane' },
      ...(children || []),
      ...(searchResults || []),
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
  render({ store, getRef, isActive, highlightIndex, itemProps }) {
    return (
      <UI.List
        if={store.results}
        controlled={isActive}
        isSelected={(item, index) => index === highlightIndex}
        itemProps={itemProps}
        items={store.results}
        getItem={result =>
          <UI.ListItem key={result.id} padding={0} height={60}>
            <item>
              {result.title}
            </item>
          </UI.ListItem>}
      />
    )
  }
}
