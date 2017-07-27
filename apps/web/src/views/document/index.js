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
}

@view.provide({
  docStore: DocumentStore,
})
export default class DocumentView {
  props: Props

  onEditor = node => {
    this.props.docStore.onEditor(node)
    if (this.props.onEditorStore) {
      this.props.onEditorStore(node)
    }
  }

  get docStore() {
    return this.props.docStore
  }

  render({
    editorProps,
    inline,
    readOnly,
    docStore,
    noTitle,
    onEditorStore,
    placeholder,
    isPrimaryDocument,
    document,
    manualSave,
    focus,
    getRef,
    ...props
  }: Props) {
    if (!docStore.document) {
      return <loading />
    }

    if (getRef) {
      getRef(this)
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
          onEditor={this.onEditor}
          noTitle={noTitle}
          placeholder={placeholder}
          focus={focus}
          {...editorProps}
        />
      </docview>
    )
  }

  static style = {
    docview: {
      maxWidth: '100%',
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
