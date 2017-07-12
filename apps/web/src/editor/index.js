// @flow
import React from 'react'
import { Editor } from 'slate'
import { view } from '@mcro/black'
import EditorStore from './stores/editorStore'
import SelectBar from './views/selectBar'
import type { ExplorerStore } from '~/stores/explorerStore'

export { Raw } from 'slate'

const empty = () => {}

export type Props = {
  rules?: Array<any>,
  plugins?: Array<any>,
  inline?: boolean,
  readOnly?: boolean,
  editorStore: EditorStore,
  explorerStore?: ExplorerStore,
}

@view.attach('explorerStore')
@view.provide({
  editorStore: EditorStore,
})
export default class EditorView {
  props: Props

  static defaultProps = {
    onChange: empty,
    onDocumentChange: empty,
    getRef: empty,
    onKeyDown: empty,
  }

  componentWillReceiveProps(nextProps: Props) {
    // todo on receive new document from server, update it here
    // needs to check equality probably
  }

  onDocumentChange = (document: Document, state: Object) => {
    this.props.editorStore.setContents(state)
  }

  onDocumentMouseUp = (event: SyntheticMouseEvent) => {
    event.persist()
    this.props.editorStore.selection.mouseUpEvent = event
  }

  render({ readOnly, editorStore }: Props) {
    const { spec } = editorStore
    const showToolbar = !editorStore.inline && readOnly !== true

    return (
      <document
        onClick={editorStore.handleDocumentClick}
        onMouseUp={this.onDocumentMouseUp}
        $fullPage={!editorStore.inline}
      >
        <Editor
          if={editorStore.state}
          state={editorStore.state}
          $editor
          $$undraggable
          editorStore={editorStore}
          readOnly={readOnly}
          plugins={spec.plugins}
          schema={spec.schema}
          onDocumentChange={this.onDocumentChange}
          onChange={editorStore.onChange}
          ref={editorStore.getRef}
          onFocus={editorStore.onFocus}
          onBlur={editorStore.onBlur}
          onKeyDown={editorStore.onKeyDown}
        />
        <SelectBar editorStore={editorStore} />
      </document>
    )
  }

  static style = {
    document: {
      // dont make this overflow hidden
      // or drag n drop wont go over sidebar
      flex: 1,
      maxWidth: '100%',
      cursor: 'text',
    },
    editor: {
      color: '#4c555a',
      fontSize: 16,
      lineHeight: 1.5,
      fontFamily: 'Whitney SSm A,Whitney SSm B,Helvetica,Arial',
      overflowY: 'scroll',
    },
  }

  static theme = {
    inline: {
      document: {
        overflow: 'hidden',
      },
    },
  }
}
