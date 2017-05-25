import { store } from '~/helpers'

@store
export default class Selection {
  hoveredNode = null
  hoveredAt = Date.now()
  selectedNode = null
  selectedAt = Date.now()
  focusedNode = null
  focusedAt = Date.now()
  clickedNode = null
  clickedAt = Date.now()

  lastNode = null

  get lastFocusedNode() {
    return this.hoveredAt > this.focusedAt ? this.hoveredNode : this.focusedNode
  }

  clearSelection = () => {
    this.selectedNode = null
  }

  setSelection = node => {
    this.selectedNode = node
    this.selectedAt = Date.now()
    this.lastNode = node
  }

  setFocus = node => {
    this.focusedNode = node
    this.focusedAt = Date.now()
    this.lastNode = node
  }

  hover = (event, node) => {
    this.hoveredNode = node
    this.hoveredAt = Date.now()
    this.lastNode = node
  }

  click = (event, node) => {
    this.clickedNode = node
    this.clickedAt = Date.now()
    this.lastNode = node
  }
}
