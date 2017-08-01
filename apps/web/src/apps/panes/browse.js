// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { filterItem } from './helpers'
import { User } from '~/app'

class BarBrowseStore {
  get root() {
    return this.props.parent || User.home
  }

  @watch children = () => this.root && this.root.getChildren()

  get filterItem() {
    return this.props.filterItem || filterItem
  }

  get results() {
    const filtered = this.filterItem(this.children, this.props.search)

    return [
      ...filtered,
      // {
      //   title: 'Create',
      //   props: {
      //     editable: true,
      //     autoselect: true,
      //     css: {
      //       opacity: 0.5,
      //     },
      //   },
      // },
    ]
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
            {...result.props}
          />}
      />
    )
  }
}
