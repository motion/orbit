import React from 'react'
import { Editor } from 'slate'
import { object } from 'prop-types'
import { Document } from '@jot/models'
import { view } from '~/helpers'
import EditorStore from './stores/editorStore'
import Popovers from './views/popovers'
import SelectBar from './views/selectBar'

export { Raw } from 'slate'

const empty = () => {}

@view.provide({
  editorStore: EditorStore,
})
export default class EditorView {
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

  render({ readOnly, editorStore }) {
    return (
      <document
        if={editorStore.state}
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
          plugins={editorStore.pluginsList}
          schema={editorStore.schema}
          state={editorStore.state}
          onDocumentChange={(document, state) => editorStore.setContents(state)}
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
