import { view } from '@jot/black'
import { Theme, PassProps, Popover, Segment, Button } from '~/ui'
import { BLOCKS, MARKS } from '../constants'

@view
export default class SelectBar {
  render({ editorStore }) {
    const { selection, pluginCategories } = editorStore

    return (
      <Popover
        if={selection.selectedNode && selection.mouseUp}
        open
        noArrow
        animation="slide 200ms"
        left={selection.mouseUp.x}
        top={selection.mouseUp.y + 30}
        escapable
      >
        <Theme name="dark">
          <bar $$row>
            {pluginCategories.map(category =>
              <Segment padded key={category}>
                {editorStore.helpers
                  .contextButtonsFor(category)
                  .map((button, i) =>
                    <PassProps editorStore={editorStore} key={i}>
                      {button}
                    </PassProps>
                  )}
              </Segment>
            )}
          </bar>
        </Theme>
      </Popover>
    )
  }
}
