import React from 'react'
import { Editor } from 'slate'
import { object } from 'prop-types'
import { Document } from '@jot/models'
import { view } from '~/helpers'
import EditorStore, { merge } from './stores/editorStore'
import Popovers from './popovers'

export { Raw } from 'slate'

const empty = () => {}

@view.attach('commanderStore')
@view.provide({
  editorStore: EditorStore,
})
export default class EditorView {
  static defaultProps = {
    onChange: empty,
    getRef: empty,
    onKeyDown: empty,
  }

  onDocumentChange = (document, state) => {
    this.props.editorStore.setContent(state)
  }

  render({
    id,
    doc,
    readOnly,
    editorStore,
    commanderStore,
    onKeyDown,
    onChange,
    inline,
    getRef,
    focusOnMount,
    ...props
  }) {
    return (
      <document
        if={editorStore.content}
        onClick={editorStore.handleDocumentClick}
        onMouseUp={(event: MouseEvent) => {
          event.persist()
          editorStore.selection.mouseUpEvent = event
        }}
      >
        <Editor
          $editor
          $$undraggable
          editorStore={editorStore}
          readOnly={readOnly}
          plugins={merge(editorStore.plugins)}
          schema={editorStore.schema}
          state={editorStore.state || editorStore.content}
          onDocumentChange={this.onDocumentChange}
          onChange={editorStore.onChange}
          ref={editorStore.getRef}
          onFocus={editorStore.focus}
          onBlur={editorStore.blur}
          onKeyDown={onKeyDown}
          {...props}
        />
        <Popovers />
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
