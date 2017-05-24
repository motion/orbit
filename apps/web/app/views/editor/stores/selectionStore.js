import { store } from '~/helpers'

@store
export default class Selection {
  focused = false
  highlightedNode = null
  hoveredNode = null
  mouseUpEvent = null
  hoverSet = null

  start() {
    this.hoverSet = new Set()
  }

  clearHighlighted = () => {
    this.highlightedNode = null
    this.mouseUpEvent = null
  }

  hover = (event, node) => {
    if (!this.hoverSet) return
    this.hoverSet = this.hoverSet.add({ event, node })
  }

  unHover = (event, node) => {
    if (!this.hoverSet) return
    this.hoverSet = this.hoverSet.delete({ event, node })
  }
}
