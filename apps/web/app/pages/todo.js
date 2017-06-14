import React from 'react'
import { view } from '@jot/black'
import { Document } from '@jot/models'
import Page from '~/page'
import DocView from '~/views/document'
import { flatten } from 'lodash'

class TodoStore {}

// just a test page, basically
@view({
  store: TodoStore,
})
export default class Todo {
  render({ store }) {
    return (
      <Page header title="Todo" actions={[]}>
        <h1>hi im todo</h1>
      </Page>
    )
  }

  static style = {
    todos: {
      padding: 30,
    },
  }
}
