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

function trackFocus(key, state, editorStore) {
  editorStore.selection.setFocus(
    findDOMNode(state.document.findDescendant(x => x.key === key)).parentNode
      .parentNode
  )
}

export default {
  onBlur(event, data, state, editor) {
    // editor.props.editorStore.selection.focused = false
  },
  onFocus(event, data, state, editor) {
    // editor.props.editorStore.selection.focused = true
  },
  onKeyDown(event, data, state, editor) {
    const block = state.selection.startBlock
    if (block) {
      trackFocus(block.key, state, editor.props.editorStore)
    }
  },
  onSelect(event, { selection }, state, editor) {
    trackSelection(selection, state, editor.props.editorStore)
    trackFocus(selection.anchorKey, state, editor.props.editorStore)
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
