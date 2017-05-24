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

  hover = (event, node) => {
    this.hoveredNode = node
  }

  unHover = (event, node) => {
    // this.hoveredNode = node
  }
}
