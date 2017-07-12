// @flow
import React from 'react'
import { view } from '@mcro/black'
import Editor from '~/views/editor'
import DocumentStore from './documentStore'
import type { Document } from '@jot/models'

type Props = {
  id?: string,
  document?: Document,
  inline?: boolean,
  readOnly?: boolean,
  editorProps?: Object,
  store: DocumentStore,
  showCrumbs?: boolean,
}

@view({
  store: DocumentStore,
})
export default class DocumentView {
  props: Props

  componentWillMount() {
    const { store, inline } = this.props
    if (!inline) store.crumbs = true
  }

  render({ editorProps, inline, readOnly, store }: Props) {
    if (!store.document) {
      return <loading />
    }

    return (
      <docview onMouseDown={store.mousedown} onMouseUp={store.mouseup}>
        <Editor
          key={store.document._id}
          readOnly={readOnly}
          inline={inline}
          getRef={store.onEditor}
          {...editorProps}
        />
      </docview>
    )
  }

  static style = {
    docview: {
      flex: 1,
      maxWidth: '100%',
      minHeight: 230,
      padding: [0],
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
