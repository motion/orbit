// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import fuzzy from 'fuzzy'
import { User } from '~/app'

class BarBrowseStore {
  @watch children = () => this.root && this.root.getChildren()

  get root() {
    return this.props.parent || User.home
  }

  get results() {
    const hayStack = this.children
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
  }

  get length() {
    return (this.results && this.results.length) || 0
  }

  select = index => {
    this.props.navigate(this.results[index])
  }
}

@view({
  store: BarBrowseStore,
})
export default class BarBrowse {
  render({ store, isActive, highlightIndex, itemProps }) {
    if (!store.results || !store.results.length) {
      return <UI.Placeholder>Empty</UI.Placeholder>
    }

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
