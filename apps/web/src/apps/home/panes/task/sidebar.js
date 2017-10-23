// @flow
import { watch } from '@mcro/black'
import Context from '~/context'
import { Person, Thing } from '~/app'

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
    this.context = new Context()
  }

  @watch
  people = () =>
    this.task &&
    Person.find()
      .where('ids.github')
      .in(this.authorIds)

  get results() {
    return [
      ...(this.people || []).map(x =>
        Person.toResult(x, { category: 'People' })
      ),
      ...(!this.context.loading
        ? this.context
            .closestItems(this.props.result.title, 30)
            .filter(x => x.item.id !== this.props.data.id)
            .map(x =>
              Thing.toResult(x.item, {
                category: 'Context',
                itemProps: { children: '' },
              })
            )
        : []),
      /*
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
        */
    ]
  }
}
