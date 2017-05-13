import { view, store } from '~/helpers'
import { Popover, Segment, Button } from '~/ui'
import { findDOMNode } from 'slate'

@store class Test {
  selection = null
}

const testStore = new Test()

@view class ToolbarPane {
  render({ children }) {
    return (
      <pane $$flex>
        {children}
        <Popover
          if={testStore.selection}
          open
          target={() => testStore.selection}
        >
          <Segment padded>
            <Button icon="textcolor" />
            <Button icon="textbackground" />
            <Button icon="textbold" />
            <Button icon="textitalic" />
            <Button icon="textquote" />
          </Segment>
        </Popover>
      </pane>
    )
  }
}

export default {
  onSelect(event, { selection }, state, editor) {
    if (selection.startOffset === selection.endOffset) {
      testStore.selection = null
      return
    }
    const selectedTextKey = selection.anchorKey
    const selectedTextNode = state.document.findDescendantDeep(
      x => x.key === selectedTextKey
    )
    // const selectedTextBlock = state.document.getClosestBlock(selectedTextNode.key)
    const selectedNode = findDOMNode(selectedTextNode)
    // const { top, left } = selectedNode.getBoundingClientRect()
    testStore.selection = selectedNode //{ top, left }
  },
  render({ children }) {
    return (
      <ToolbarPane>
        {children}
      </ToolbarPane>
    )
  },
}
