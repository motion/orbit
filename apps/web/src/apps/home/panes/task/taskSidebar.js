// @flow
import * as React from 'react'
import { watch } from '@mcro/black'
import { Person } from '~/app'
import Context from '~/views/context'
import * as UI from '@mcro/ui'
import { SidebarTitle } from '../helpers'

export default class TaskSidebarStore {
  last = null

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

  willMount() {
    console.log('in will mount')
    window.sb = this
    this.context = new Context({ search: this.props.result.title })
    this.clearId = setInterval(() => (this.last = this.context.last), 100)
  }

  willUnmount() {
    clearInterval(this.clearId)
  }

  @watch
  people = () =>
    this.task &&
    Person.find()
      .where('ids.github')
      .in(this.authorIds)

  get results() {
    console.log('props are ', this.props)
    return [
      {
        type: 'task',
        isParent: true,
        result: this.props.result,
        title: this.props.result.title,
        display: <SidebarTitle {...this.props} />,
        onClick: this.props.onBack,
        id: this.props.data.id,
      },
      ...(this.people || []).map(x =>
        Person.toResult(x, { category: 'People' })
      ),
      ...(this.last || [])
        .filter(item => item.id !== this.props.data.id)
        .map(item => ({
          title: item.title,
          iconAfter: true,
          icon: `social-${'github'}`,
          key: item.id,
          body: (item.body || '').slice(0, 200),
          type: 'task',
          result: item,
          data: {
            id: item.id,
            integration: item.integration,
            type: item.type,
            body: (item.body || '').slice(0, 200),
          },
          id: item.data.id,
          // display: Thing.toResult(item, { category: 'Context' }),
        })),
    ]
  }
}
