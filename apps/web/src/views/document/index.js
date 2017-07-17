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

@view.provide({
  docStore: DocumentStore,
})
export default class DocumentView {
  props: Props

  render({
    editorProps,
    inline,
    readOnly,
    docStore,
    noTitle,
    ...props
  }: Props) {
    if (!docStore.document) {
      return <loading />
    }

    return (
      <docview
        onMouseDown={docStore.mousedown}
        onMouseUp={docStore.mouseup}
        {...props}
      >
        <Editor
          key={docStore.document.id}
          readOnly={readOnly}
          inline={inline}
          getRef={docStore.onEditor}
          noTitle={noTitle}
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
