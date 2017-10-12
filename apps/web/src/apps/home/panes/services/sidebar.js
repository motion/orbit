// @flow
import * as React from 'react'
import { SidebarTitle } from '../helpers'

export default class ServicesSidebarStore {
  results = [
    {
      type: 'services',
      isParent: true,
      result: this.props.result,
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
