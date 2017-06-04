import React from 'react'
import { view } from '~/helpers'
import { Document } from '@jot/models'
import Page from '~/views/page'
import DocView from '~/views/document'
import { flatten } from 'lodash'

class TodoStore {
  docs = Document.recent()

  get todoDocs() {
    return (this.docs || []).filter(doc => {
      if (!doc.content.document) return false
      return (
        doc.content.document.nodes.filter(node => node.type === 'ul_list')
          .length > 0
      )
    })
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
          {store.todoDocs.map(doc => (
            <doc>
              <h4 onClick={() => Router.go(doc.url())}>{doc.title}</h4>
              <DocView
                inline
                editorProps={{ onlyNode: 'ul_list' }}
                id={doc._id}
              />
            </doc>
          ))}
        </todos>
      </Page>
    )
  }

  static style = {
    todos: {
      padding: 30,
    },
  }
}
