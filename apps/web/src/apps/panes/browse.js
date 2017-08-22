// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { filterItem } from './helpers'
import { CurrentUser } from '~/app'
import { isNumber } from 'lodash'

class BarBrowseStore {
  start() {
    this.props.getRef && this.props.getRef(this)
  }

  @watch
  children = [
    () => this.parent && this.parent.id,
    () => this.parent && this.parent.getChildren({ depth: Infinity }),
  ]

  get parent() {
    return this.props.data.parent || CurrentUser.home
  }

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
  render({ store, activeIndex, highlightIndex, paneProps }) {
    if (store.length === 0) {
      return <UI.Placeholder>Empty</UI.Placeholder>
    }

    return (
      <browse>
        <UI.List
          if={store.results}
          selected={isNumber(activeIndex) ? activeIndex : highlightIndex}
          itemProps={paneProps.itemProps}
          items={store.results}
          getItem={(result, index) =>
            <UI.ListItem
              onClick={() => onSelect(index)}
              key={result.id}
              icon={result.icon}
              icon={result.icon}
              primary={result.title}
            />}
        />
      </browse>
    )
  }
}
