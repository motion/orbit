import { store } from '~/helpers'

@store
export default class Selection {
  hoveredNode = null
  selectedNode = null
  focusedNode = null
  focusedAt = Date.now()
  hoveredAt = Date.now()

  get lastFocusedNode() {
    return this.hoveredAt > this.focusedAt ? this.hoveredNode : this.focusedNode
  }

  clearSelection = () => {
    this.selectedNode = null
  }

  setSelection = node => {
    this.selectedNode = node
    this.selectedAt = Date.now()
  }

  setFocus = node => {
    this.focusedNode = node
    this.focusedAt = Date.now()
  }

  hover = (event, node) => {
    this.hoveredNode = node
    this.hoveredAt = Date.now()
  }

  unHover = (event, node) => {
    // this.hoveredNode = node
  }
}
