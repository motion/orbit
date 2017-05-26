import { view } from '~/helpers'
import { Popover, Segment, Button } from '~/ui'
import { BLOCKS, MARKS } from '../constants'

@view
export default class SelectBar {
  toggleMark = mark => () => {
    this.props.editorStore.transform(t => t.toggleMark(mark))
  }

  toggleBlock = mark => () => {
    this.props.editorStore.transform(t => t.setBlock(mark))
  }

  render({ editorStore }) {
    const { selection } = editorStore
    const PAD = 40

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
          <Segment theme="dark" padded if={false}>
            <Button icon="link" tooltip="link" />
            <Button icon="media-image" tooltip="image" />
            <Button icon="textquote" tooltip="quote" />
            <Button icon="code" tooltip="code" />
          </Segment>

          <Segment theme="dark" padded>
            <Button icon="textcolor" />
            <Button icon="textbackground" />
            <Button icon="textbold" onClick={this.toggleMark(MARKS.BOLD)} />
            <Button icon="textitalic" onClick={this.toggleMark(MARKS.ITALIC)} />
            <Button icon="textquote" onClick={this.toggleBlock(BLOCKS.QUOTE)} />
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
