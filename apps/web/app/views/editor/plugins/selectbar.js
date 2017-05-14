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
          <bar $$row>
            <Segment padded>
              <Button icon="textcolor" />
              <Button icon="textbackground" />
              <Button icon="textbold" />
              <Button icon="textitalic" />
              <Button icon="textquote" />
            </Segment>

            <Segment padded>
              <Button icon="align-left" />
              <Button icon="align-right" />
              <Button icon="align-center" />
              <Button icon="align-justify" />
            </Segment>

            <Segment padded>
              <Button icon="list-bullet" />
              <Button icon="list-number" />
              <Button icon="margin-left" />
              <Button icon="margin-right" />
            </Segment>
          </bar>
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
