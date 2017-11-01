// @flow
import { watch } from '@mcro/black'
import ContextStore from '~/stores/contextStore'
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
    this.context = new ContextStore()
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
    ]
  }
}
