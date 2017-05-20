import { store } from '~/helpers'

@store class Selection {
  focused = false
  highlightedNode = null
  active = null
  cursorNode = null
  mouseUpEvent = null

  clearHighlighted = () => {
    this.highlighted = null
    this.mouseUpEvent = null
  }
}

export default new Selection()
