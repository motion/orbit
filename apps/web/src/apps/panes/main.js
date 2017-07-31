// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import fuzzy from 'fuzzy'
import { User, Document } from '~/app'
import { uniq } from 'lodash'

class BarMainStore {
  searchResults: Array<Document> = []
  @watch children = () => this.currentDoc && this.currentDoc.getChildren()

  get currentDoc() {
    return User.home
  }

  get results() {
    const { children, searchResults } = this
    const hayStack = [
      { title: 'Notifications' },
      ...(children || []),
      ...(searchResults || []),
    ]
    return fuzzy
      .filter(this.value, hayStack, {
        extract: el => el.title,
        pre: '<',
        post: '>',
      })
      .map(item => item.original)
      .filter(x => !!x)
  }

  get highlightedDocument() {
    if (this.highlightIndex === -1) return null
    return this.results[this.highlightIndex]
  }

  start() {
    this.watch(async () => {
      if (!this.isTypingPath) {
        // search
        const [searchResults, pathSearchResults] = await Promise.all([
          Document.search(this.value).exec(),
          Document.collection
            .find()
            .where('slug')
            .regex(new RegExp(`^${this.value}`, 'i'))
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

  select = index => {
    this.props.navigate(this.results[index])
  }
}

@view({
  store: BarMainStore,
})
export default class BarMain {
  render({ store, highlightIndex, itemProps }) {
    log('got results', store.results)
    return (
      <UI.List
        if={store.results}
        controlled={store.column === 0}
        isSelected={(item, index) => index === highlightIndex}
        itemProps={{
          size: 2.5,
          glow: false,
          hoverable: true,
          ...itemProps,
        }}
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
