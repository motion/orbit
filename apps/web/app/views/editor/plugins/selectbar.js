import { view, store } from '~/helpers'
import { Popover, Segment, Button } from '~/ui'
import { findDOMNode } from 'slate'

@store class SelectBarStore {
  node = null
  event = null

  clear = () => {
    this.node = null
    this.event = null
  }
}

const select = new SelectBarStore()

@view class ToolbarPane {
  render({ children }) {
    console.log(select.event)
    console.log(select.event && select.event.clientX)

    return (
      <pane>
        {children}
        <Popover if={select.node} open target={() => select.node}>
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

  static style = {
    pane: {
      flex: 1,
    },
  }
}

export default {
  onSelect(event, { selection }, state, editor) {
    if (selection.startOffset === selection.endOffset) {
      select.clear()
      return
    }
    const selectedTextKey = selection.anchorKey
    const selectedTextNode = state.document.findDescendantDeep(
      x => x.key === selectedTextKey
    )
    const node = findDOMNode(selectedTextNode)
    select.node = node
    select.event = event
  },
  render({ children }) {
    return (
      <ToolbarPane>
        {children}
      </ToolbarPane>
    )
  },
}
