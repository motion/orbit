// @flow
import * as React from 'react'
import { SidebarTitle } from '../helpers'

export default class TaskSidebarStore {
  results = [
    {
      type: 'task',
      parent: {
        type: 'task',
        id: this.props.data.id,
        data: this.props.data,
      },
      display: <SidebarTitle {...this.props} />,
      onClick: this.props.onBack,
      id: this.props.data.id,
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
