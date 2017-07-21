// @flow
import React from 'react'
import { view } from '@mcro/black'
import Editor from '~/views/editor'
import DocumentStore from './documentStore'
import type { Document } from '@jot/models'
import Actions from './actions'
import Children from './children'

const SIDEBAR_WIDTH = '30%'

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
    if (this.props.editorRef) {
      this.props.editorRef(node)
    }
  }

  get showSidebar() {
    return this.props.showActions || this.props.showChildren
  }

  render({
    editorProps,
    inline,
    readOnly,
    docStore,
    noTitle,
    editorRef,
    placeholder,
    showActions,
    showChildren,
    ...props
  }: Props) {
    if (!docStore.document) {
      return <loading />
    }

    const { showSidebar } = this

    return (
      <docview
        $showSidebar={showSidebar}
        onMouseDown={docStore.mousedown}
        onMouseUp={docStore.mouseup}
        {...props}
      >
        <Editor
          key={docStore.document.id}
          readOnly={readOnly}
          inline={inline}
          getRef={this.onEditor}
          noTitle={noTitle}
          placeholder={placeholder}
          {...editorProps}
        />
        <sidebar if={showSidebar}>
          <Actions if={showActions} />
          <Children if={showChildren} />
          <line />
          <fade />
        </sidebar>
      </docview>
    )
  }

  static style = {
    docview: {
      maxWidth: '100%',
      minHeight: 200,
      padding: [0],
      flexFlow: 'row',
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    showSidebar: {
      width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    },
    sidebar: {
      width: SIDEBAR_WIDTH,
      overflow: 'hidden',
      zIndex: 50,
      top: 0,
      right: 0,
      pointerEvents: 'none',
    },
    line: {
      position: 'absolute',
      top: -20,
      right: 31,
      bottom: 0,
      width: 1,
      background: '#eee',
      zIndex: -2,
    },
    fade: {
      position: 'absolute',
      top: -20,
      left: 0,
      right: 0,
      height: 60,
      background: 'linear-gradient(#fff, transparent)',
      zIndex: -1,
    },
  }
}
