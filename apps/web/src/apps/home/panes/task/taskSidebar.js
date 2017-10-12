// @flow
import * as React from 'react'
import { watch } from '@mcro/black'
import { Person } from '~/app'
import { SidebarTitle } from '../helpers'

export default class TaskSidebarStore {
  get taskStore() {
    return this.props.stackItem.store
  }

  get task() {
    return this.taskStore && this.taskStore.task
  }

  get authorIds() {
    return this.task && [this.task.author]
  }

  @watch
  people = () =>
    this.task &&
    Person.find({ ids: { $eq: { github: { $in: this.authorIds } } } })

  results = [
    {
      type: 'task',
      parent: this.props.result,
      title: this.props.result.title,
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
