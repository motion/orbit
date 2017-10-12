// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Pane from '~/apps/pane'
import getItem from './getItem'
import SidebarTitle from './sidebarTitle'

class SidebarFeedStore {
  results = [
    {
      type: 'feed',
      data: this.props.data,
      display: <SidebarTitle {...this.props} />,
      onClick: this.props.onBack,
      id: this.props.data.id,
    },
    {
      title: 'Product',
      category: 'People',
      type: 'message',
      icon: 'pin',
    },
    {
      title: 'Product',
      category: 'People',
      type: 'message',
      icon: 'pin',
    },
    {
      title: 'Product',
      category: 'People',
      type: 'message',
      icon: 'pin',
    },
    {
      title: 'Product',
      category: 'People',
      type: 'message',
      icon: 'pin',
    },
  ]
}

@view({
  store: SidebarFeedStore,
})
export default class SidebarFeedColumn {
  componentDidMount() {
    console.log('moutn feed sidebar', this.props)
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
