import { findDOMNode } from 'slate'
import Selection from '../stores/selection'
import SelectBar from './selectBar'
import InsertButton from './insertButton'

function trackSelection(selection, state) {
  // not highlighted
  const sameBlock = selection.startKey === selection.endKey
  const isHighlighting = selection.startOffset !== selection.endOffset

  if (sameBlock && !isHighlighting) {
    Selection.clearHighlighted()
    return
  }

  const key = selection.anchorKey
  Selection.highlightedNode = findDOMNode(
    state.document.findDescendant(x => x.key === key)
  )
}

function trackFocus(selection, state) {
  Selection.active = selection
  Selection.cursorNode = findDOMNode(
    state.document.findDescendant(x => x.key === selection.anchorKey)
  )
}

export default {
  onBlur() {
    Selection.focused = false
  },
  onFocus() {
    Selection.focused = true
  },
  onSelect(event, { selection }, state) {
    trackSelection(selection, state)
    trackFocus(selection, state)
  },
  render({ children }) {
    return (
      <pane style={{ flex: 1 }}>
        {children}
        <SelectBar />
        <InsertButton />
      </pane>
    )
  },
}
