import { store } from '~/helpers'

@store
export default class Selection {
  focused = false
  highlightedNode = null
  hoveredNode = null
  mouseUpEvent = null
  hovered = new Set()

  clearHighlighted = () => {
    this.highlightedNode = null
    this.mouseUpEvent = null
  }

  hover = (event, node) => {
    this.hovered = this.hovered.add({ event, node })
  }

  unHover = (event, node) => {
    this.hovered = this.hovered.delete({ event, node })
  }
}
