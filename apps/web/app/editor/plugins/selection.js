// @flow
import { findParent } from '~/editor/helpers'

function trackSelection(selection, state, editorStore) {
  // not highlighted
  const sameBlock = selection.startKey === selection.endKey
  const isHighlighting = selection.startOffset !== selection.endOffset
  if (sameBlock && !isHighlighting) {
    editorStore.selection.clear('selected')
    return
  }
  editorStore.selection.setSelection(
    findParent(state.document, selection.anchorKey)
  )
}

function trackFocus(key, state, editorStore) {
  editorStore.selection.setFocus(findParent(state.document, key))
}

export default class Selection {
  name = 'selection'

  plugins = [
    {
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
          <pane
            style={{ flex: 1 }}
            onMouseUp={(event: MouseEvent) => {
              event.persist()
              editorStore.selection.mouseUp = {
                x: event.clientX,
                y: event.clientY,
              }
            }}
          >
            {children}
          </pane>
        )
      },
    },
  ]
}
