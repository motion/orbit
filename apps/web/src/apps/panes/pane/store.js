import { actionToKeyCode } from './helpers'
import { random, without, intersection, includes, flatten } from 'lodash'

const toggleInclude = (xs, x) => (includes(xs, x) ? without(xs, x) : [...xs, x])

export default class PaneStore {
  version = 0
  metaKey = false
  actions = []

  start() {
    document.addEventListener('keydown', e => {
      if (!this.props.isActive) return
      this.metaKey = e.metaKey

      if (this.metaKey) {
        ;(this.allActions || []).forEach(action => {
          if (actionToKeyCode(action) === e.keyCode) {
            e.preventDefault()
            console.log('executing action', action)
          }
        })
      }
    })
    document.addEventListener('keyup', e => {
      this.metaKey = e.metaKey
    })
  }

  get allActions() {
    const { activeItem } = this.props.millerState
    return [...(this.actions || []), ...(activeItem.actions || [])]
  }

  get toolbarActions() {
    const { millerState, isActive } = this.props

    if (!isActive) return false
    return (millerState.activeItem && millerState.activeItem.actions) || []
    /*

    if (this.selectedIds.length > 0) {
      return intersection.apply(
        null,
        this.selectedIds.map(id => {
          console.log('getting id', id)
          return this.activeCards[id].actions
        })
      )
    }
    */

    return null
  }
}
