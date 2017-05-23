import { view } from '~/helpers'
import { Popover, CircleButton } from '~/ui'
import Selection from '../stores/selection'

@view
export default class InsertButton {
  render({ children }) {
    return (
      <Popover
        if={false && Selection.cursorNode}
        open
        noArrow
        towards="left"
        background
        animation="slide 300ms"
        target={() => Selection.cursorNode}
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
