// @flow
import * as React from 'react'
import { SidebarTitle } from '../helpers'

export default class FeedSidebar {
  results = [
    {
      type: 'feed',
      isParent: true,
      result: this.props.result,
      displayTitle: false,
      children: <SidebarTitle {...this.props} />,
      onClick: this.props.onBack,
      id: this.props.result.id,
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
