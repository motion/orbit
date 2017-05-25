import { store } from '~/helpers'
import { findDOMNode } from '../helpers'
import { BLOCKS } from '../constants'

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

  isDocTitle = block =>
    block && block.type === BLOCKS.TITLE && node.data.get('level') === 1
  isParagraph = block => block && block.type === BLOCKS.PARAGRAPH

  get showEdit() {
    return this.isEditable(this.lastBlock)
  }

  get showInsert() {
    return this.isInsertable(this.lastBlock)
  }

  isInsertable = block => {
    if (!block) return false
    if (this.isDocTitle(block)) return false
    switch (block.type) {
      case BLOCKS.PARAGRAPH:
        return true
    }
  }

  isEditable = block => {
    if (!block) return false
    if (this.isDocTitle(block)) return false
    if (this.isParagraph(block)) return false
    return true
  }

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
