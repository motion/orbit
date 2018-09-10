import { react, ensure } from '@mcro/black'
import { getTargetPosition } from '../helpers/getTargetPosition'
import { OrbitItemProps } from './OrbitItemProps'
import { ResolvedItem } from '../components/ItemResolver'
import { Actions } from '../actions/Actions'

export class OrbitItemStore {
  props: OrbitItemProps
  resolvedItem: ResolvedItem = null
  isSelected = false
  cardWrapRef = null
  clickAt = 0
  hoverSettler = null

  didMount() {
    if (this.props.hoverToSelect) {
      this.hoverSettler = this.props.selectionStore.getHoverSettler()
      this.hoverSettler.setItem({
        index: this.props.index,
      })
    }
  }

  handleClick = e => {
    // so we can control the speed of double clicks
    if (Date.now() - this.clickAt < 220) {
      this.open()
      e.stopPropagation()
    }
    this.clickAt = Date.now()
    if (this.props.onClick) {
      this.props.onClick(e, this.cardWrapRef)
      return
    }
    if (this.props.onSelect) {
      this.props.onSelect(this.cardWrapRef)
      return
    }
    if (this.props.inactive) {
      return
    }
    this.props.selectionStore.toggleSelected(this.realIndex, 'click')
  }

  open = () => {
    if (!this.props.model || this.props.model.target === 'setting') {
      return
    }
    Actions.openItem(this.props.model)
  }

  setCardWrapRef = cardWrapRef => {
    if (!cardWrapRef) return
    this.cardWrapRef = cardWrapRef
  }

  setResolvedItem = (item: ResolvedItem) => {
    this.resolvedItem = item
  }

  get target() {
    return this.props.result || this.props.model
  }

  get position() {
    const position = getTargetPosition(this.cardWrapRef)
    // list items are closer to edge, adjust...
    if (this.props.listItem === true) {
      position.left += 5
    }
    return position
  }

  get realIndex() {
    const { model, getIndex, index } = this.props
    return getIndex ? getIndex(model) : index
  }

  // this cancels to prevent renders very aggressively
  updateIsSelected = react(
    () => [
      this.props.selectionStore && this.props.selectionStore.activeIndex,
      this.props.subPaneStore && this.props.subPaneStore.isActive,
      typeof this.props.isSelected === 'function'
        ? this.props.isSelected()
        : this.props.isSelected,
    ],
    async ([activeIndex, isPaneActive, isSelected], { sleep }) => {
      ensure('active', isPaneActive)
      const { preventAutoSelect, subPaneStore } = this.props
      let nextIsSelected
      if (typeof isSelected === 'boolean') {
        nextIsSelected = isSelected
      } else {
        nextIsSelected = activeIndex === this.realIndex
      }
      ensure('new index', nextIsSelected !== this.isSelected)
      this.isSelected = nextIsSelected
      if (nextIsSelected && !preventAutoSelect) {
        if (subPaneStore) {
          subPaneStore.scrollIntoView(this.cardWrapRef)
        }
        ensure('target', !!this.target)
        // fluidity
        await sleep(16)
        Actions.setPeekApp(this.target, this.position)
      }
    },
  )
}
