// @flow
import * as React from 'react'
import { SidebarTitle } from '../helpers'

export default class TaskSidebarStore {
  willMount() {
    console.log('TAASAS', this.props)
  }

  get taskStore() {
    return this.props.stackItem.store
  }

  get task() {
    return this.taskStore && this.taskStore.task
  }

  results = [
    {
      type: 'task',
      parent: this.props.result,
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
