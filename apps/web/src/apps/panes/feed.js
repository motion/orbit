// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import fuzzy from 'fuzzy'

class BarFeedStore {
  get results() {
    const hayStack = [{ title: 'Item 1' }]
    return fuzzy
      .filter(this.props.search, hayStack, {
        extract: el => el.title,
        pre: '<',
        post: '>',
      })
      .map(item => item.original)
      .filter(x => !!x)
  }
}

@view({
  store: BarFeedStore,
})
export default class BarFeed {
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
