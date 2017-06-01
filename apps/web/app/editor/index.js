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
  }

  static defaultProps = {
    onChange: empty,
    onDocumentChange: empty,
    getRef: empty,
    onKeyDown: empty,
  }

  componentWillReceiveProps(nextProps) {
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

    return (
      <document
        onClick={editorStore.handleDocumentClick}
        onMouseUp={this.onDocumentMouseUp}
      >
        <SlotFill.Fill if={!editorStore.inline} name="documentActions">
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
    inline: (() => {
      const scaleBy = 5

      return {
        transform: `scale(${1 / scaleBy})`,
        width: `${scaleBy * 100}%`,
        transformOrigin: `top left`,
        overflow: 'visible',
        transform: 'all 150ms ease-in',
      }
    })(),
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
        overflow: 'hidden',
      },
    },
  }
}
