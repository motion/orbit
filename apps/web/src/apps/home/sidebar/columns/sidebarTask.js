// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Pane from '~/apps/pane'
import getItem from './getItem'

class SidebarTaskStore {
  results = [
    {
      title: this.props.data.title,
      type: 'task',
      data: this.props.data,
    },
    {
      title: 'Product',
      category: 'Teams',
      type: 'message',
      icon: 'pin',
    },
    {
      title: 'Product',
      category: 'Teams',
      type: 'message',
      icon: 'pin',
    },
    {
      title: 'Product',
      category: 'Teams',
      type: 'message',
      icon: 'pin',
    },
    {
      title: 'Product',
      category: 'Teams',
      type: 'message',
      icon: 'pin',
    },
  ]
}

@view({
  store: SidebarTaskStore,
})
export default class SidebarTaskColumn {
  componentDidMount() {
    this.props.setStore(this.props.store)
  }

  render({ store, data, paneProps }) {
    return (
      <Pane
        items={store.results}
        getItem={getItem(paneProps.getActiveIndex)}
        {...paneProps}
      />
    )
  }
}
