// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { fuzzy } from '~/helpers'
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

  get results() {
    return this.children ? fuzzy(this.children, this.props.search) : []
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
  render({ store, activeIndex, highlightRow, paneProps }) {
    if (store.length === 0) {
      return <UI.Placeholder>Empty</UI.Placeholder>
    }

    return (
      <browse>
        <UI.List
          if={store.results}
          selected={isNumber(activeIndex) ? activeIndex : highlightRow}
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
