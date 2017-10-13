// @flow
import * as React from 'react'
import { watch } from '@mcro/black'
import { Person } from '~/app'
import { SidebarTitle } from '../helpers'

export default class TaskSidebarStore {
  get taskStore() {
    return this.props.stackItem.mainStore
  }

  get task() {
    return this.taskStore && this.taskStore.task
  }

  get authorIds() {
    return (
      this.task && [
        this.task.author,
        ...this.task.data.comments.map(comment => comment.author.login),
      ]
    )
  }

  @watch
  people = () =>
    this.task &&
    Person.find()
      .where('ids.github')
      .in(this.authorIds)

  get results() {
    return [
      {
        type: 'task',
        parent: this.props.result,
        title: this.props.result.title,
        display: <SidebarTitle {...this.props} />,
        onClick: this.props.onBack,
        id: this.props.data.id,
      },
      ...(this.people || []).map(x =>
        Person.toResult(x, { category: 'People' })
      ),
    ]
  }
}
