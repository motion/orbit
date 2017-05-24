import { view } from '~/helpers'
import { Popover, CircleButton } from '~/ui'

@view.attach('editorStore')
@view
export default class InsertButton {
  render({ children, editorStore }) {
    return (
      <Popover
        if={false && editorStore.selection.cursorNode}
        open
        noArrow
        towards="left"
        background
        animation="slide 300ms"
        target={() => editorStore.selection.cursorNode}
      >
        <CircleButton
          style={{
            gloss: true,
            opacity: 0.5,
            '&:hover': {
              opacity: 1,
            },
          }}
          icon="add"
          size={30}
          iconProps={{ color: '#999' }}
        />
      </Popover>
    )
  }
}
