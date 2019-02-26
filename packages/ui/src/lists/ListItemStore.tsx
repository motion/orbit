import { ensure, react } from '@mcro/use-store';
import { ListItemProps } from './ListItem';

// TEMP i dont want to write the three level hoist to make this work quite yet
export const OrbitItemSingleton = {
  lastClick: Date.now(),
}

let lastSelectAt = Date.now()

export class ListItemStore {
  props: ListItemProps

  isSelected = false
  cardWrapRef = null
  clickAt = 0
  hoverSettler = null

  get didClick() {
    return Date.now() - this.clickAt < 50
  }

  handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // so we can control the speed of doubleclicks
    if (Date.now() - this.clickAt < 280) {
      // allow double click of location
      if (Date.now() - this.lastClickLocation < 280) {
        if (this.props.onClickLocation) {
          this.props.onClickLocation(this.index)
        }
        return
      }
      if (this.props.onOpen) {
        this.props.onOpen(this.index, 'click')
      } else {
        console.log('no open event for item', this.props)
      }
    }
    this.clickAt = Date.now()
    OrbitItemSingleton.lastClick = this.clickAt
    if (this.props.onClick) {
      e.stopPropagation()
      e.preventDefault()
      this.props.onClick(e)
    }
    if (this.props.onSelect) {
      this.props.onSelect(this.index, 'click')
    }
  }

  lastClickLocation = Date.now()

  handleClickLocation = () => {
    this.lastClickLocation = Date.now()
  }

  setCardWrapRef = next => {
    if (!next) return
    if (next !== this.cardWrapRef) {
      this.cardWrapRef = next
    }
  }

  get index() {
    const { getIndex, index } = this.props
    return getIndex ? getIndex(index) : index
  }

  getIsSelected = () => {
    const { isSelected, disableSelect } = this.props
    if (disableSelect === true) {
      return false
    }
    if (typeof isSelected === 'boolean') {
      return isSelected
    }
    if (typeof isSelected === 'function') {
      return isSelected(this.index)
    }
    return false
  }

  updateIsSelected = react(this.getIsSelected, async (isSelected, { sleep }) => {
    const { onSelect } = this.props
    ensure('changed', isSelected !== this.isSelected)
    // set this before doing callbacks to allow for instant update
    this.isSelected = isSelected

    const selectedRecently = Date.now() - lastSelectAt < 80
    lastSelectAt = Date.now()

    if (isSelected) {
      ensure('not clicked', Date.now() - this.clickAt > 10)

      if (selectedRecently) {
        await sleep(40)
      }

      if (onSelect) {
        onSelect(this.index, 'key')
      } else {
        console.log('no preview event for', this.index)
      }
    }
  })
}
