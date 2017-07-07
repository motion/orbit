// @flow
import React from 'react'
import { view } from '@mcro/black'
import Editor from '~/views/editor'
import DocumentStore from './documentStore'
import Children from './children'
import type { Document } from '@jot/models'

type Props = {
  id?: string,
  document?: Document,
  inline?: boolean,
  readOnly?: boolean,
  editorProps?: Object,
  store: DocumentStore,
  showCrumbs?: boolean,
  showChildren?: boolean,
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

  render({ editorProps, inline, showChildren, readOnly, store }: Props) {
    if (!store.document) {
      return <loading />
    }

    return (
      <docview onMouseDown={store.mousedown} onMouseUp={store.mouseup}>
        <content $$row>
          <Editor
            key={store.document._id}
            readOnly={readOnly}
            inline={inline}
            getRef={store.onEditor}
            {...editorProps}
          />
          <Children if={!inline && showChildren} id={store.document._id} />
        </content>
      </docview>
    )
  }

  static style = {
    docview: {
      flex: 1,
      maxWidth: '100%',
      padding: [10, 0],
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
