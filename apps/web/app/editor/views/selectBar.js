import { view } from '~/helpers'
import { PassThrough, Popover, Segment, Button } from '~/ui'
import { BLOCKS, MARKS } from '../constants'

@view
export default class SelectBar {
  render({ editorStore }) {
    const { selection, barButtons, pluginCategories } = editorStore
    const PAD = 40

    console.log(
      pluginCategories.map(category => (
        <Segment theme="dark" padded key={category}>
          {editorStore.buttonsFor(category).map((button, i) => (
            <PassThrough key={i}>
              {button}
            </PassThrough>
          ))}
        </Segment>
      ))
    )

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
        <bar $$row>
          {pluginCategories.map(category => (
            <Segment theme="dark" padded key={category}>
              {editorStore.buttonsFor(category).map((button, i) => (
                <PassThrough key={i}>
                  {button}
                </PassThrough>
              ))}
            </Segment>
          ))}
        </bar>
      </Popover>
    )
  }
}
