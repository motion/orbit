// @flow
import React from 'react'
import { view } from '~/helpers'
import { Icon } from '~/ui'
import Editor from '~/views/editor'
import DocumentStore from './store'

@view({
  store: DocumentStore,
})
export default class DocumentView {
  props: {
    id?: string,
    focusOnMount?: boolean,
    insidePlace?: boolean,
    inline?: boolean,
  }

  render({ id, find, readOnly, store }) {
    if (!store.document) {
      return <loading />
    }

    return (
      <docview onMouseDown={store.mousedown} onMouseUp={store.mouseup}>
        <document>
          <Editor
            readOnly={readOnly}
            find={find}
            inline={this.props.inline}
            onEditor={store.onEditor}
          />
        </document>
      </docview>
    )
  }

  static style = {
    docview: {
      flex: 1,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    document: {
      padding: 0,
      maxWidth: 1250,
      flex: 1,
    },
  }
}
