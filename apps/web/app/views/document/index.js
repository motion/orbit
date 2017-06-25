// @flow
import React from 'react'
import { view } from '@jot/black'
import { SlotFill } from '~/ui'
import Editor from '~/views/editor'
import DocumentStore from './documentStore'
import Breadcrumbs from './breadcrumbs'
import Children from './children'

type Props = {
  id?: string,
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

  render({
    id,
    editorProps,
    inline,
    showCrumbs,
    showChildren,
    readOnly,
    store,
  }: Props) {
    if (!store.document) {
      return <loading />
    }

    return (
      <docview onMouseDown={store.mousedown} onMouseUp={store.mouseup}>
        <Breadcrumbs
          if={showCrumbs}
          key={store.document._id}
          document={store.document}
        />
        <Editor
          readOnly={readOnly}
          inline={inline}
          getRef={store.onEditor}
          {...editorProps}
        />
        <Children if={!inline && showChildren} id={store.document._id} />
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
