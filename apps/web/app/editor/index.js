// @flow
import React from 'react'
import { Editor } from 'slate'
import { object } from 'prop-types'
import { Document } from '@jot/models'
import { view } from '~/helpers'
import EditorStore from './stores/editorStore'
import Popovers from './views/popovers'
import SelectBar from './views/selectBar'
import Bar from './views/bar'
import { SlotFill } from '~/ui'

export { Raw } from 'slate'

const empty = () => {}

@view.provide({
  editorStore: EditorStore,
})
export default class EditorView {
  props: {
    rules?: Array,
    plugins?: Array,
    inline?: boolean,
  }

  static defaultProps = {
    onChange: empty,
    onDocumentChange: empty,
    getRef: empty,
    onKeyDown: empty,
  }

  componentWillReceiveProps(nextProps) {
    this.props.editorStore.find = nextProps.find
    // todo on receive new document from server, update it here
    // needs to check equality probably
  }

  onDocumentChange = (document, state) => {
    this.props.editorStore.setContents(state)
  }

  onDocumentMouseUp = (event: MouseEvent) => {
    event.persist()
    this.props.editorStore.selection.mouseUpEvent = event
  }

  render({ readOnly, editorStore }) {
    const { spec } = editorStore

    const showToolbar = !editorStore.inline && readOnly !== true

    return (
      <document
        onClick={editorStore.handleDocumentClick}
        onMouseUp={this.onDocumentMouseUp}
        $fullPage={!editorStore.inline}
      >
        <SlotFill.Fill if={showToolbar} name="documentActions">
          <Bar editorStore={editorStore} />
        </SlotFill.Fill>
        <Editor
          if={editorStore.state}
          $editor
          $$undraggable
          editorStore={editorStore}
          readOnly={readOnly}
          plugins={spec.plugins}
          schema={spec.schema}
          state={editorStore.state}
          onDocumentChange={this.onDocumentChange}
          onChange={editorStore.onChange}
          ref={editorStore.getRef}
          onFocus={editorStore.onFocus}
          onBlur={editorStore.onBlur}
          onKeyDown={editorStore.onKeyDown}
          key={editorStore.find}
        />
        <Popovers editorStore={editorStore} />
        <SelectBar editorStore={editorStore} />
      </document>
    )
  }

  static style = {
    document: {
      flex: 1,
      cursor: 'text',
    },
    fullPage: {
      marginTop: 20,
    },
    editor: {
      color: '#4c555a',
      fontSize: 16,
      lineHeight: 1.5,
      fontFamily: 'Whitney SSm A,Whitney SSm B,Helvetica,Arial',
    },
  }

  static theme = {
    inline: {
      document: {
        padding: 5,
        overflow: 'hidden',
      },
    },
  }
}
