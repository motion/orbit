import { react, ensure } from '@mcro/black'
import { OrbitItemProps } from './OrbitItemProps'
import { Logger } from '@mcro/logger'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { useHook } from '@mcro/use-store'

const log = new Logger('OrbitItemStore')

// TEMP i dont want to write the three level hoist to make this work quite yet
export const OrbitItemSingleton = {
  lastClick: Date.now(),
}

export class OrbitItemStore {
  props: OrbitItemProps<any>
  stores = useHook(useStoresSafe)

  isSelected = false
  cardWrapRef = null
  clickAt = 0
  hoverSettler = null

  setHoverSettler = react(
    () => this.props.hoverToSelect,
    hoverSelect => {
      ensure('hoverSelect', !!hoverSelect)
      ensure('!hoverSettler', !this.hoverSettler)
      this.hoverSettler = this.stores.appStore.getHoverSettler()
      this.hoverSettler.setItem({
        index: this.props.index,
      })
    },
  )

  get didClick() {
    return Date.now() - this.clickAt < 50
  }

  handleClick = (e: React.SyntheticEvent<MouseEvent>) => {
    // so we can control the speed of doubleclicks
    if (Date.now() - this.clickAt < 280) {
      // allow double click of location
      if (Date.now() - this.lastClickLocation < 280) {
        if (this.props.onClickLocation) {
          this.props.onClickLocation(this.props.item)
        }
        return
      }
      if (this.props.onOpen) {
        this.props.onOpen(this.index, this.props.appConfig)
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
      return
    }
    this.stores.appStore.toggleSelected(this.index, 'click')
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
    const { item, getIndex, index } = this.props
    return getIndex ? getIndex(item) : index
  }

  shouldSelect = () => {
    const { activeCondition, ignoreSelection, isSelected } = this.props
    const { appStore } = this.stores
    if (typeof isSelected === 'undefined') {
      if (ignoreSelection) {
        return false
      }
      if (typeof activeCondition === 'function' && activeCondition() === false) {
        return false
      }
      if (!appStore || !appStore.isActive) {
        return false
      }
    }
    const forceSelected = typeof isSelected === 'function' ? isSelected(this.index) : isSelected
    let next = false
    if (typeof forceSelected === 'boolean') {
      next = forceSelected
    } else {
      next = appStore && appStore.activeIndex === this.index
    }
    return next
  }

  updateIsSelected = react(
    this.shouldSelect,
    async (isSelected, { sleep }) => {
      const { onSelect } = this.props
      ensure('new index', isSelected !== this.isSelected)
      this.isSelected = isSelected
      if (isSelected) {
        // give it a little delay to allow fast keyboard movement down lists
        await sleep(10)
        if (onSelect) {
          onSelect(this.index, this.props.appConfig)
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
