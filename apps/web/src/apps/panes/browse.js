// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { filterItem } from './helpers'
import { User } from '~/app'
import { isNumber } from 'lodash'

class BarBrowseStore {
  @watch
  children = [
    () => this.parent && this.parent.id,
    () => this.parent && this.parent.getChildren(),
  ]

  get parent() {
    return this.props.data.parent || User.home
  }

  get filterItem() {
    return this.props.filterItem || filterItem
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
  getLength = () => this.props.store.length

  getChildSchema = row => {
    const { store } = this.props
    const data = { parent: store.results[row] }
    return { kind: 'browse', data }
  }

  render({ store, onRef, activeIndex, highlightIndex, itemProps }) {
    onRef(this)
    if (!store.results || !store.results.length) {
      return <UI.Placeholder>Empty</UI.Placeholder>
    }

    return (
      <UI.List
        if={store.results}
        controlled={false}
        selected={isNumber(activeIndex) ? activeIndex : highlightIndex}
        itemProps={itemProps}
        items={store.results}
        getItem={result =>
          <UI.ListItem
            key={result.id}
            icon={result.icon}
            icon={result.icon}
            primary={result.title}
          />}
      />
    )
  }
}
