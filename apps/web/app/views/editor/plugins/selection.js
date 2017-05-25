import { findDOMNode } from 'slate'
import SelectBar from './selectBar'
import InsertButton from './insertButton'

function findParent(document, key) {
  return document.nodes.find(node => node.findDescendant(x => x.key === key))
}

function findParentNode(document, key) {
  return findDOMNode(findParent(document, key))
}

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
    findParentNode(state.document, key).parentNode
  )
}

function trackFocus(key, state, editorStore) {
  editorStore.selection.setFocus(findParentNode(state.document, key).parentNode)
}

export default {
  onKeyDown(event, data, state, editor) {
    // trackFocus(state.selection.anchorKey, state, editor.props.editorStore)
  },
  onSelect(event, { selection }, state, editor) {
    console.log('onselect', selection)
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
