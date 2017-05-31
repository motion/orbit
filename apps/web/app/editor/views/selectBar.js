import { view } from '~/helpers'
import { Theme, PassThrough, Popover, Segment, Button } from '~/ui'
import { BLOCKS, MARKS } from '../constants'

@view
export default class SelectBar {
  render({ editorStore }) {
    const { selection, barButtons, pluginCategories } = editorStore
    const PAD = 40

    console.log('pluginCategories', pluginCategories)

    return (
      <Popover
        if={selection.selectedNode && selection.mouseUp}
        open
        noArrow
        background
        animation="slide 300ms"
        left={selection.mouseUp.x}
        top={selection.mouseUp.y + PAD}
        escapable
      >
        <Theme name="dark">
          <bar $$row>
            {pluginCategories.map(category => (
              <Segment padded key={category}>
                {editorStore.buttonsFor(category).map((button, i) => (
                  <PassThrough editorStore={editorStore} key={i}>
                    {button}
                  </PassThrough>
                ))}
              </Segment>
            ))}
          </bar>
        </Theme>
      </Popover>
    )
  }
}
