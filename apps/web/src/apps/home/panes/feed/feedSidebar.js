// @flow
import * as React from 'react'
import { SidebarTitle } from '../helpers'

export default class FeedSidebarStore {
  results = [
    {
      type: 'feed',
      isParent: true,
      data: this.props.data,
      display: <SidebarTitle {...this.props} />,
      onClick: this.props.onBack,
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
