import { store } from '~/helpers'

@store
export default class Selection {
  focused = false
  highlightedNode = null
  hoveredNode = null
  mouseUpEvent = null

  clearHighlighted = () => {
    this.highlightedNode = null
    this.mouseUpEvent = null
  }

  setHovered = (event, node) => {
    this.hoveredNode = node
  }
}
