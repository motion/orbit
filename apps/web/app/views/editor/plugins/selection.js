import { findDOMNode } from 'slate'
import SelectBar from './selectBar'
import InsertButton from './insertButton'

function trackSelection(selection, state, editorStore) {
  // not highlighted
  const sameBlock = selection.startKey === selection.endKey
  const isHighlighting = selection.startOffset !== selection.endOffset

  if (sameBlock && !isHighlighting) {
    editorStore.selection.clearSelection()
    return
  }

  const key = selection.anchorKey
  editorStore.selection.setSelection(
    findDOMNode(state.document.findDescendant(x => x.key === key))
  )
}

function trackFocus(selection, state, editorStore) {
  editorStore.selection.setFocus(
    findDOMNode(
      state.document.findDescendant(x => x.key === selection.anchorKey)
    ).parentNode.parentNode
  )
}

export default {
  onBlur(event, data, state, editor) {
    // editor.props.editorStore.selection.focused = false
  },
  onFocus(event, data, state, editor) {
    // editor.props.editorStore.selection.focused = true
  },
  onKeyDown(event, { selection }, state, editor) {
    trackFocus(selection, state, editor.props.editorStore)
  },
  onSelect(event, { selection }, state, editor) {
    trackSelection(selection, state, editor.props.editorStore)
    trackFocus(selection, state, editor.props.editorStore)
  },
  render({ children, editorStore }) {
    return (
      <pane style={{ flex: 1 }}>
        {children}
        <SelectBar editorStore={editorStore} />
        <InsertButton editorStore={editorStore} />
      </pane>
    )
  },
}
