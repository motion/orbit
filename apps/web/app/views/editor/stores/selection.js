import { store } from '~/helpers'

@store class Selection {
  focused = false
  highlightedNode = null
  active = null
  cursorNode = null
  mouseUpEvent = null

  start() {
    // this.watch(() => {
    //   console.log('cursorNode', this.cursorNode)
    // })
    // this.watch(() => {
    //   console.log('highlighted', this.highlightedNode)
    // })
  }

  clearHighlighted = () => {
    this.highlighted = null
    this.mouseUpEvent = null
  }
}

export default new Selection()
