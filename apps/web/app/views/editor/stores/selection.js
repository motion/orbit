import { store } from '~/helpers'

@store class Selection {
  node = null
  mouseUpEvent = null

  clear = () => {
    this.node = null
    this.mouseUpEvent = null
  }
}

export default new Selection()
