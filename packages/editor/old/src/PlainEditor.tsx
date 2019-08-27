import { useStore } from '@o/use-store'
import React from 'react'
import { Editor } from 'slate'

import { EditorStore } from './EditorStore'
import { SelectBar } from './SelectBar'

export { Raw } from 'slate'

export type Props = {
  rules?: any[]
  plugins?: any[]
  inline?: boolean
  readOnly?: boolean
  placeholder?: any
}

export function EditorView({ placeholder, readOnly }: Props) {
  const editorStore = useStore(EditorStore)
  const { spec } = editorStore

  const onDocumentChange = (document: Document, state: Object) => {
    editorStore.setContents(state)
  }

  const onDocumentMouseUp = (event: SyntheticMouseEvent) => {
    event.persist()
    editorStore.selection.mouseUpEvent = event
  }

  return (
    <div
      onClick={editorStore.handleDocumentClick}
      onMouseUp={onDocumentMouseUp}
      style={{
        cursor: !readOnly ? 'text' : 'default',
        flex: 1,
        maxWidth: '100%',
      }}
      $fullPage={!editorStore.inline}
      $editable={!readOnly}
    >
      <Editor
        if={editorStore.state}
        state={editorStore.state}
        style={{
          color: '#444',
          fontSize: 16,
          lineHeight: 1.5,
          fontFamily: 'Whitney SSm A,Whitney SSm B,Helvetica,Arial',
        }}
        $$undraggable
        editorStore={editorStore}
        readOnly={readOnly}
        plugins={spec.plugins}
        schema={spec.schema}
        onDocumentChange={onDocumentChange}
        onChange={editorStore.onChange}
        ref={editorStore.getRef}
        onFocus={editorStore.onFocus}
        onBlur={editorStore.onBlur}
        onKeyDown={editorStore.onKeyDown}
        placeholder={placeholder}
      />
      <SelectBar editorStore={editorStore} />
    </div>
  )
}
