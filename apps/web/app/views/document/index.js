// @flow
import React from 'react'
import { view } from '@jot/black'
import { Icon } from '~/ui'
import Editor from '~/views/editor'
import DocumentStore from './store'
import Crumbs from './crumbs'

type Props = {
  id?: string,
  focusOnMount?: boolean,
  insidePlace?: boolean,
  inline?: boolean,
  readOnly?: boolean,
  editorProps?: Object,
  store: DocumentStore,
}

@view({
  store: DocumentStore,
})
export default class DocumentView {
  props: Props

  componentWillMount() {
    const { store, inline } = this.props
    if (!inline) store.shouldLoadCrumbs = true
  }

  render({ id, editorProps, inline, readOnly, store }: Props) {
    if (!store.document) {
      return <loading />
    }

    return (
      <docview onMouseDown={store.mousedown} onMouseUp={store.mouseup}>
        <Crumbs if={!inline} docs={store.crumbs} />

        <Editor
          readOnly={readOnly}
          inline={inline}
          onEditor={store.onEditor}
          {...editorProps}
        />
      </docview>
    )
  }

  static style = {
    docview: {
      flex: 1,
      maxWidth: '100%',
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
