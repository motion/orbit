import { react, ensure } from '@mcro/black'
import { Logger } from '@mcro/logger'
import { ListItemProps } from './ListItem'

const log = new Logger('OrbitItemStore')

// TEMP i dont want to write the three level hoist to make this work quite yet
export const OrbitItemSingleton = {
  lastClick: Date.now(),
}

export class ListItemStore {
  props: ListItemProps

  isSelected = false
  cardWrapRef = null
  clickAt = 0
  hoverSettler = null

  get didClick() {
    return Date.now() - this.clickAt < 50
  }

  handleClick = (e: React.SyntheticEvent<MouseEvent>) => {
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
        this.props.onOpen(this.index)
      } else {
        console.log('no open event for item', this.props)
      }
    }
    this.clickAt = Date.now()
    OrbitItemSingleton.lastClick = this.clickAt
    if (this.props.onClick) {
      e.stopPropagation()
      e.preventDefault()
      this.props.onClick(e, this.cardWrapRef)
    }
    if (this.props.onSelect) {
      this.props.onSelect(this.index)
    }
  }

  lastClickLocation = Date.now()

  handleClickLocation = () => {
    this.lastClickLocation = Date.now()
  }

  setCardWrapRef = cardWrapRef => {
    if (!cardWrapRef) {
      return
    }
    this.cardWrapRef = cardWrapRef
  }

  get index() {
    const { getIndex, index } = this.props
    return getIndex ? getIndex(index) : index
  }

  getIsSelected = () => {
    const { isSelected, onSelect } = this.props
    if (onSelect === false) {
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

  updateIsSelected = react(
    this.getIsSelected,
    async (isSelected, { sleep }) => {
      const { onSelect } = this.props
      console.log('next selection, isSelected', isSelected, this.isSelected, this)
      ensure('new index', isSelected !== this.isSelected)
      // set this before doing callbacks to allow for instant update
      this.isSelected = isSelected
      if (isSelected) {
        // delay to allow fast keyboard movement down lists
        await sleep(30)
        console.log('call on select due t reaction.....', JSON.stringify(this.props))
        if (onSelect) {
          onSelect(this.index)
        } else {
          log.info('no preview event for', this.index)
        }
      }
    },
    {
      deferFirstRun: true,
    },
  )
}
