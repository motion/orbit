import { store } from '~/helpers'
import { findDOMNode } from '../helpers'
import { BLOCKS } from '../constants'

@store
export default class Selection {
  mouseUp = null
  hovered = null
  hoveredNode = null
  selected = null
  selectedNode = null
  focused = null
  focusedNode = null
  clicked = null
  clickedNode = null
  lastBlock = null
  lastNode = null

  isDocTitle = block =>
    block && block.type === BLOCKS.TITLE && block.data.get('level') === 1
  isParagraph = block => block && block.type === BLOCKS.PARAGRAPH

  get showEdit() {
    return this.isEditable(this.lastBlock)
  }

  get showInsert() {
    return this.isInsertable(this.lastBlock)
  }

  isInsertable = block => {
    if (!block) return false
    switch (block.type) {
      case BLOCKS.PARAGRAPH:
        return true
    }
    return false
  }

  isEditable = block => {
    if (!block) return false
    if (this.isDocTitle(block)) return false
    if (this.isParagraph(block)) return false
    return true
  }

  clear = key => {
    this[key] = null
    this[`${key}Node`] = null
  }

  update = (key, block, node) => {
    this[key] = block
    this[`${key}Node`] = node
    this.lastNode = node
    this.lastBlock = block
  }

  setSelection = block => {
    const node = findDOMNode(block).parentNode
    this.update('selected', block, node)
  }

  setFocus = block => {
    const node = findDOMNode(block).parentNode
    this.update('focused', block, node)
  }

  setHovered = (block, node) => {
    this.update('hovered', block, node)
  }

  setClicked = (block, node) => {
    this.update('clicked', block, node)
  }
}
