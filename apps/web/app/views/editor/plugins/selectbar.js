import { view } from '~/helpers'
import { Popover, Segment, Button } from '~/ui'

@view.attach('editorStore')
@view
export default class SelectBar {
  render() {
    const PAD = 40

    return (
      <Popover
        if={
          false &&
            editorStore.selection.highlightedNode &&
            editorStore.selection.mouseUpEvent
        }
        open
        noArrow
        background
        animation="slide 300ms"
        left={editorStore.selection.mouseUpEvent.clientX}
        top={editorStore.selection.mouseUpEvent.clientY + PAD}
      >
        <bar $$row>
          <Segment theme="dark" padded if={false}>
            <Button icon="link" tooltip="link" />
            <Button icon="media-image" tooltip="image" />
            <Button icon="textquote" tooltip="quote" />
            <Button icon="code" tooltip="code" />
          </Segment>

          <Segment theme="dark" padded>
            <Button icon="textcolor" />
            <Button icon="textbackground" />
            <Button icon="textbold" />
            <Button icon="textitalic" />
            <Button icon="textquote" />
          </Segment>

          <Segment theme="dark" padded>
            <Button icon="align-left" />
            <Button icon="align-right" />
            <Button icon="align-center" />
            <Button icon="align-justify" />
          </Segment>

          <Segment theme="dark" padded>
            <Button icon="list-bullet" />
            <Button icon="list-number" />
            <Button icon="margin-left" />
            <Button icon="margin-right" />
          </Segment>
        </bar>
      </Popover>
    )
  }
}
