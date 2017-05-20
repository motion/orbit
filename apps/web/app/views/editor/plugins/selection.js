import { findDOMNode } from 'slate'
import Selection from '../stores/selection'
import SelectBar from './selectBar'
import InsertButton from './insertButton'

function trackSelection(selection, state) {
  // avoid selectbar on title/meta
  if (state.document.nodes.indexOf(state.startBlock) < 1) {
    return
  }
  // not highlighted
  if (selection.startOffset === selection.endOffset) {
    Selection.clear()
    return
  }
  Selection.highlightedNode = findDOMNode(
    state.document.findDescendantDeep(x => x.key === selection.anchorKey)
  )
}

function trackFocus(selection, state) {
  Selection.active = selection
  Selection.cursorNode = findDOMNode(
    state.document.findDescendantDeep(x => x.key === selection.anchorKey)
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
    Selection.mouseUpEvent = event
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
