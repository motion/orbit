import { view } from '~/helpers'
import { Popover } from '~/ui'

@view
export default class InsertButton {
  render({ children }) {
    return (
      <Popover
        if={Selection.cursorNode}
        open
        noArrow
        background
        animation="slide 300ms"
        target={() => Selection.cursorNode}
      >
        insert!
      </Popover>
    )
  }
}
