import { actionToKeyCode } from './helpers'
import { random, without, intersection, includes, flatten } from 'lodash'

const toggleInclude = (xs, x) => (includes(xs, x) ? without(xs, x) : [...xs, x])

export default class PaneStore {
    version = 0
    metaKey = false

    selectedIds = []
    activeCards = {}
    visibleActions = {}
    cardIdByIndex = {}

    getActiveIndex = () => {
        const { millerState, isActive } = this.props
        return isActive ? millerState.activeRow : null
    }

    setIndex = index => {
        this.props.millerState.setActiveRow(index)
    }

    start() {
        return
        document.addEventListener('keydown', e => {
            console.log('key down', e.metaKey, this.props.isActive)
            if (!this.props.isActive) return

            this.metaKey = e.metaKey
            console.log('setting meta to ', this.metaKey)

            // x
            if (this.metaKey && e.keyCode === 88) {
                this.toggleActive()
            }

            if (this.metaKey) {
                ; (this.allActions || []).forEach(action => {
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

    toggleActive = () => {
        if (this.activeIndex === null) return
        this.toggleId(this.activeId)
    }

    toggleId = id => {
        this.selectedIds = toggleInclude(this.selectedIds, id)
        // this.version++
    }

    addCard = options => {
        this.cardIdByIndex[options.index] = options.id
        this.activeCards[options.id] = options
    }

    removeCard = ({ id, index }) => {
        delete this.cardIdByIndex[index]
        delete this.activeCards[id]
    }

    addActions = actions => {
        const id = random(0, 1000000)
        this.visibleActions[id] = actions
        return id
    }

    removeActions = id => {
        delete this.visibleActions[id]
    }

    get activeId() {
        return this.cardIdByIndex[this.activeIndex]
    }

    get allActions() {
        return flatten(Object.values(this.visibleActions))
    }

    get selectedCount() {
        return this.selectedIds.length
    }

    get toolbarActions() {
        if (this.selectedIds.length > 0) {
            return intersection.apply(
                null,
                this.selectedIds.map(id => {
                    console.log('getting id', id)
                    return this.activeCards[id].actions
                })
            )
        }

        return null
    }
}
