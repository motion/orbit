import { view } from '~/helpers'
import { Place, Document } from '@jot/models'
import { Page, CircleButton } from '~/views'
import { toJS, computed } from 'mobx'
import { flatten } from 'lodash'

class TodoStore {
  docs = Document.recent()
  place = null

  @computed get todos() {
    return flatten(
      (this.docs || []).map(doc => {
        if (!doc.content.document) return []
        return doc.content.document.nodes
          .filter(node => {
            return node.type === 'todo'
          })
          .map(todo => {
            return Object.assign({}, todo.data, {
              text: todo.nodes[0].ranges[0].text,
            })
          })
      })
    )
  }
}

@view({
  store: TodoStore,
})
export default class Todo {
  render({ store }) {
    return (
      <Page header title="Todo" actions={[]}>
        <todos>
          {store.todos.map(todo => (
            <todo key={Math.random()}>
              <input type="checkbox" checked={todo.done} />
              <p>{todo.text}</p>
            </todo>
          ))}
        </todos>
      </Page>
    )
  }

  static style = {
    todo: {
      flexFlow: 'row',
    },
  }
}
