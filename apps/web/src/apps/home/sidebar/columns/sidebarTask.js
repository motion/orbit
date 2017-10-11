// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Pane from '~/apps/pane'
import getItem from './getItem'

class SidebarTaskStore {
  results = [
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

  render({ store, paneProps }) {
    return (
      <Pane
        items={store.results}
        getItem={getItem(paneProps.getActiveIndex)}
        {...paneProps}
      />
    )
  }
}
