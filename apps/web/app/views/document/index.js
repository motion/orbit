// @flow
import React from 'react'
import { view } from '~/helpers'
import { Icon } from '~/ui'
import Editor from '~/editor'
import DocumentStore from './store'
import type CommanderStore from '~/stores/commander'

@view.attach('commanderStore')
@view({
  store: DocumentStore,
})
export default class DocumentView {
  props: {
    id?: string,
    document?: Object,
    commanderStore: CommanderStore,
    focusOnMount?: boolean,
    insidePlace?: boolean,
  }

  render({ id, store }) {
    if (!store.document) {
      return <loading>loading</loading>
    }

    return (
      <docview onMouseDown={store.mousedown} onMouseUp={store.mouseup}>
        <document>
          <Editor onEditor={store.onEditor} state={store.document.content} />
        </document>
      </docview>
    )
  }

  static style = {
    docview: {
      flex: 1,
      flexFlow: 'row',
    },
    document: {
      padding: [8, 0],
      width: '100%',
    },
  }
}
