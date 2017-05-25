import { store } from '~/helpers'
import { findDOMNode } from '../helpers'

@store
export default class Selection {
  hovered = null
  hoveredNode = null
  hoveredAt = Date.now()
  selected = null
  selectedNode = null
  selectedAt = Date.now()
  focused = null
  focusedNode = null
  focusedAt = Date.now()
  clicked = null
  clickedNode = null
  clickedAt = Date.now()

  lastBlock = null
  lastNode = null

  clearSelection = () => {
    this.selectedNode = null
  }

  setSelection = block => {
    this.selected = block
    const node = findDOMNode(block).parentNode
    this.selectedNode = node
    this.selectedAt = Date.now()
    this.lastNode = node
    this.lastBlock = block
  }

  setFocus = block => {
    this.focused = block
    const node = findDOMNode(block).parentNode
    this.focusedNode = node
    this.focusedAt = Date.now()
    this.lastNode = node
    this.lastBlock = block
  }

  hover = (block, node) => {
    this.hoveredNode = node
    this.hoveredAt = Date.now()
    this.lastNode = node
    this.lastBlock = block
  }

  click = (block, node) => {
    this.clickedNode = node
    this.clickedAt = Date.now()
    this.lastNode = node
    this.lastBlock = block
  }
}
